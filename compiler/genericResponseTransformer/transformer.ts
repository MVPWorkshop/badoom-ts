import * as ts from 'typescript';

const helper = {
  name: 'openapi:types',
  scoped: false,
  priority: 4,
  text: '\n            var __open_api_types = (this && this.__open_api_types) || function (v) {\n                if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata("design:open_api_types", v);\n            };'
};

export default function transformer(program: ts.Program): ts.TransformerFactory<ts.SourceFile> {
  return (context: ts.TransformationContext) => (file: ts.SourceFile) => visitNodeAndChildren(file, program, context);
}

function visitNodeAndChildren(node: ts.SourceFile, program: ts.Program, context: ts.TransformationContext): ts.SourceFile;
function visitNodeAndChildren(node: ts.Node, program: ts.Program, context: ts.TransformationContext): ts.Node;
function visitNodeAndChildren(node: ts.Node, program: ts.Program, context: ts.TransformationContext): ts.Node {
  return ts.visitEachChild(visitNode(node, program, context), childNode => visitNodeAndChildren(childNode, program, context), context);
}

function visitNode(node: ts.Node, program: ts.Program, context: ts.TransformationContext): ts.Node {
  const typeChecker = program.getTypeChecker();

  const promiseNode = getPromiseNode(node, typeChecker);

  if (!promiseNode) {
    return node;
  }

  const responseTypes = extractPromiseTypeNodes(promiseNode as ts.TypeReferenceNode, typeChecker);
  const args: ts.NodeArray<ts.Expression> = ts.createNodeArray<ts.Expression>([
    ts.createArrayLiteral(responseTypes as ts.Expression[])
  ]);

  context.requestEmitHelper(helper);
  const dec = ts.createExpressionStatement(ts.createCall(ts.createIdentifier('__open_api_types'), [], args));

  const decorators: ts.NodeArray<ts.Decorator> = node.decorators || ts.createNodeArray<ts.Decorator>([]);

  // @ts-ignore
  decorators.push(dec);

  const newNode = ts.getMutableClone(node);

  newNode.decorators = decorators;

  return newNode;
}

function getPromiseNode(node: ts.Node, typeChecker: ts.TypeChecker): ts.Node | undefined {
  if (node.kind !== ts.SyntaxKind.MethodDeclaration) {
    return undefined;
  }

  let promiseNode: ts.Node = undefined;

  node.getChildren().forEach(child => {
    if (child.kind !== ts.SyntaxKind.TypeReference) {
      return;
    }

    const type = typeChecker.getTypeFromTypeNode(child as ts.TypeNode);

    if (!type.symbol || type.symbol.escapedName !== 'Promise') {
      return undefined;
    }

    promiseNode = child;
  });

  return promiseNode;
}

function extractPromiseTypeNodes(node: ts.TypeReferenceNode, typeChecker: ts.TypeChecker): ts.Node[] {
  let nodes: ts.Node[] = [];

  node.typeArguments.forEach((childNode: ts.Node) => {
    const type = typeChecker.getTypeFromTypeNode(childNode as ts.TypeNode);
    if (type.isUnion() || childNode.kind === ts.SyntaxKind.UnionType) {
      nodes = (<ts.UnionTypeNode>childNode).types.filter(isNotKeywordNode).map(subtype => {
        return createNameNode(subtype as ts.TypeReferenceNode, childNode);
      });
      return;
    }

    nodes = [createNameNode(childNode as ts.TypeReferenceNode, node)];
  });

  return nodes;
}

function createNameNode(node: ts.TypeReferenceNode, parent: ts.Node): ts.Node {
  const name = ts.getMutableClone(node.typeName);
  name.flags &= ~8;
  name.parent = ts.getParseTreeNode(parent);

  return name;
}

function isNotKeywordNode(node: ts.Node): boolean {
  return node.kind !== ts.SyntaxKind.AnyKeyword && node.kind !== ts.SyntaxKind.UnknownKeyword && node.kind !== ts.SyntaxKind.NumberKeyword && node.kind !== ts.SyntaxKind.ObjectKeyword && node.kind !== ts.SyntaxKind.BooleanKeyword && node.kind !== ts.SyntaxKind.StringKeyword && node.kind !== ts.SyntaxKind.SymbolKeyword && node.kind !== ts.SyntaxKind.ThisKeyword && node.kind !== ts.SyntaxKind.VoidKeyword && node.kind !== ts.SyntaxKind.UndefinedKeyword && node.kind !== ts.SyntaxKind.NullKeyword && node.kind !== ts.SyntaxKind.NeverKeyword;
}
