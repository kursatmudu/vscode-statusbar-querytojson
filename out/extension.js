"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
let convertedString = '';
let copytext = '';
let windowStatus;
function activate(context) {
    windowStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    windowStatus.command = 'querytojson.qts';
    windowStatus.show();
    context.subscriptions.push(windowStatus);
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(e => updateStatus(windowStatus)));
    context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(e => updateStatus(windowStatus)));
    context.subscriptions.push(vscode.window.onDidChangeTextEditorViewColumn(e => updateStatus(windowStatus)));
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(e => updateStatus(windowStatus)));
    context.subscriptions.push(vscode.workspace.onDidCloseTextDocument(e => updateStatus(windowStatus)));
    context.subscriptions.push(vscode.commands.registerCommand('New Path', async () => { await vscode.env.clipboard.writeText(copytext); }));
    context.subscriptions.push(vscode.commands.registerCommand('querytojson.qts', async () => {
        await vscode.env.clipboard.writeText(convertedString);
    }));
    updateStatus(windowStatus);
}
exports.activate = activate;
function updateStatus(windowStatus) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        windowStatus.text = '';
        return;
    }
    const text = editor.document.getText();
    if (!text.includes('=') || !text.includes(';')) {
        return;
    }
    else {
        var new_split;
        var pointsplit = "";
        var laststript;
        let point;
        var textsplit = text.split(";");
        for (point of textsplit) {
            new_split = point.split('=');
            if (new_split.length >= 3) {
                pointsplit += '"' + new_split[0].replaceAll(" ", "") + ':' + new_split[1].replaceAll(" ", "") + '",';
            }
            else {
                laststript = '"' + point.replaceAll(" ", "").replaceAll("=", '":"') + '",';
            }
            if (laststript != '"",') {
                pointsplit += laststript;
            }
        }
        convertedString = ('{' + (pointsplit === null || pointsplit === void 0 ? void 0 : pointsplit.slice(0, -1)) + '}');
        var str = JSON.parse(convertedString);
        var status_text = Object.keys(str)[0];
        windowStatus.text = 'QToJ: {"' + status_text + '": ..."}';
        windowStatus.tooltip = 'Click copy to clipboard';
    }
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map