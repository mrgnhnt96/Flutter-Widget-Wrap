// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// // this method is called when your extension is activated
// // your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {

// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	console.log('Congratulations, your extension "flutter-widget-wrap" is now active!');

// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	let disposable = vscode.commands.registerCommand('flutter-widget-wrap.helloWorld', () => {
// 		// The code you place here will be executed every time your command is executed

// 		// Display a message box to the user
// 		vscode.window.showInformationMessage('Hello World from Flutter Widget Wrap!');
// 	});

// 	context.subscriptions.push(disposable);
// }

// // this method is called when your extension is deactivated
export function deactivate() { }

function getSpacer() {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.options.insertSpaces) {
        return " ".repeat(<number>editor.options.tabSize);
    }
    return "\t";
}

function insertSnippet(
    before: string,
    after: string,
    space: string,
    replaceComma?: boolean | false
) {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.selection.start !== editor.selection.end) {
        var selection = editor.selection;
        var child = editor.document.getText(selection).trimLeft();
        var line = editor.document.lineAt(selection.start);
        child = child.replace(
            new RegExp("\n\\s{" + line.firstNonWhitespaceCharacterIndex + "}", "gm"),
            "\n" + space
        );
        if (replaceComma) {
            if (child.substr(-1) === ",") {
                child = child.substr(0, child.length - 1);
                child += ";";
            }
        }
        var replaceText = before + child + after;
        // TODO: add logic to add ; at the end and replace ';' with a comma
        if (
            child.substr(-1) === "," ||
            (child.substr(-1) === ";" && replaceComma)
        ) {
            replaceText += ",";
        }
        editor.insertSnippet(new vscode.SnippetString(replaceText), selection);
    }
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "flutter-widget-wrap.wrapInSingleChildWidget",
            () =>
                insertSnippet(
                    "${1:widget}(\n" + getSpacer() + "child: $2",
                    "\n)",
                    getSpacer()
                )
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            "flutter-widget-wrap.wrapInBuilderWidget",
            () =>
                insertSnippet(
                    "${1:Builder}(\n" +
                    getSpacer() +
                    "${2:builder}: (${3:context}) {\n" +
                    getSpacer() +
                    getSpacer() +
                    "return ",
                    "\n},\n" + ")",
                    getSpacer(),
                    true
                )
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            "flutter-widget-wrap.wrapInChildrenWidget",
            () =>
                insertSnippet(
                    "${1:widget}(\n" +
                    getSpacer() +
                    "children: [\n" +
                    getSpacer().repeat(2),
                    "$2\n" + getSpacer() + "],\n)",
                    getSpacer().repeat(2)
                )
        )
    );
}
