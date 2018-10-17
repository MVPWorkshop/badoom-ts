"use strict";
exports.__esModule = true;
var ts = require("typescript");
var helper = {
    name: 'openapi:types',
    scoped: false,
    priority: 4,
    text: '\n            var __open_api_types = (this && this.__open_api_types) || function (v) {\n                if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata("design:open_api_types", v);\n            };'
};
function transformer(program) {
    return function (context) { return function (file) { return visitNodeAndChildren(file, program, context); }; };
}
exports["default"] = transformer;
function visitNodeAndChildren(node, program, context) {
    return ts.visitEachChild(visitNode(node, program, context), function (childNode) { return visitNodeAndChildren(childNode, program, context); }, context);
}
function visitNode(node, program, context) {
    var typeChecker = program.getTypeChecker();
    var promiseNode = getPromiseNode(node, typeChecker);
    if (!promiseNode) {
        return node;
    }
    var responseTypes = extractPromiseTypeNodes(promiseNode, typeChecker);
    var args = ts.createNodeArray([
        ts.createArrayLiteral(responseTypes)
    ]);
    context.requestEmitHelper(helper);
    var dec = ts.createExpressionStatement(ts.createCall(ts.createIdentifier('__open_api_types'), [], args));
    var decorators = node.decorators || ts.createNodeArray([]);
    // @ts-ignore
    decorators.push(dec);
    var newNode = ts.getMutableClone(node);
    newNode.decorators = decorators;
    return newNode;
}
function getPromiseNode(node, typeChecker) {
    if (node.kind !== ts.SyntaxKind.MethodDeclaration) {
        return undefined;
    }
    var promiseNode = undefined;
    node.getChildren().forEach(function (child) {
        if (child.kind !== ts.SyntaxKind.TypeReference) {
            return;
        }
        var type = typeChecker.getTypeFromTypeNode(child);
        if (!type.symbol || type.symbol.escapedName !== 'Promise') {
            return undefined;
        }
        promiseNode = child;
    });
    return promiseNode;
}
function extractPromiseTypeNodes(node, typeChecker) {
    var nodes = [];
    node.typeArguments.forEach(function (childNode) {
        var type = typeChecker.getTypeFromTypeNode(childNode);
        if (type.isUnion() || childNode.kind === ts.SyntaxKind.UnionType) {
            nodes = childNode.types.filter(isNotKeywordNode).map(function (subtype) {
                if (subtype.kind !== ts.SyntaxKind.ArrayType) {
                    return createNameNode(subtype, childNode);
                }
                return createNameNode(subtype.elementType, childNode);
            });
            return;
        }
        if (!isNotKeywordNode(childNode)) {
            return;
        }
        if (childNode.kind === ts.SyntaxKind.ArrayType) {
            nodes = [createNameNode(childNode.elementType, node)];
            return;
        }
        nodes = [createNameNode(childNode, node)];
    });
    return nodes;
}
function createNameNode(node, parent) {
    var name = ts.getMutableClone(node.typeName);
    name.flags &= ~8;
    name.parent = ts.getParseTreeNode(parent);
    return name;
}
function isNotKeywordNode(node) {
    return node.kind !== ts.SyntaxKind.AnyKeyword && node.kind !== ts.SyntaxKind.UnknownKeyword && node.kind !== ts.SyntaxKind.NumberKeyword && node.kind !== ts.SyntaxKind.ObjectKeyword && node.kind !== ts.SyntaxKind.BooleanKeyword && node.kind !== ts.SyntaxKind.StringKeyword && node.kind !== ts.SyntaxKind.SymbolKeyword && node.kind !== ts.SyntaxKind.ThisKeyword && node.kind !== ts.SyntaxKind.VoidKeyword && node.kind !== ts.SyntaxKind.UndefinedKeyword && node.kind !== ts.SyntaxKind.NullKeyword && node.kind !== ts.SyntaxKind.NeverKeyword;
}
