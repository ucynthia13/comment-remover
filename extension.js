const vscode = require('vscode');
const { spawnSync } = require('child_process');
const path = require('path');

function activate(context) {
  let disposable = vscode.commands.registerCommand('extension.removeComments', async function () {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found!');
      return;
    }

    const code = editor.document.getText();
    const scriptPath = path.join(__dirname,'main.py');

    const result = spawnSync('python', [scriptPath], {
      input: code,
      encoding: 'utf-8'
    });

    if (result.error) {
      vscode.window.showErrorMessage("Error running comment remover: " + result.error.message);
      return;
    }

    if (result.stderr) {
      vscode.window.showErrorMessage("Error output from Python script: " + result.stderr);
      return;
    }

    console.log(result.stdout);

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
