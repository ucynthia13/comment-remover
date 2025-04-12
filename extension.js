const vscode = require('vscode');
const { spawnSync } = require('child_process');
const fs = require('fs');

function activate(context) {
  let disposable = vscode.commands.registerCommand('extension.removeComments', async function () {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const code = editor.document.getText();

    const result = spawnSync('python', ['index.py'], {
      input: code,
      encoding: 'utf-8'
    });

    if (result.error) {
      vscode.window.showErrorMessage("Error running comment remover: " + result.error.message);
      return;
    }

    const fullRange = new vscode.Range(
      editor.document.positionAt(0),
      editor.document.positionAt(code.length)
    );

    editor.edit(editBuilder => {
      editBuilder.replace(fullRange, result.stdout);
    });
  });

  context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
