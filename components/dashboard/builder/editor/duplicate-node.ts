import type { useEditor } from "@craftjs/core";

type Query = ReturnType<typeof useEditor>["query"];
type Actions = ReturnType<typeof useEditor>["actions"];

export function duplicateNode(query: Query, actions: Actions, id: string) {
  const node = query.node(id).get();
  const parentId = node.data.parent;
  if (!parentId) return;

  const parentNode = query.node(parentId).get();
  const index = parentNode.data.nodes.indexOf(id);

  const freshNode = query
    .parseFreshNode({ data: { type: node.data.type, props: { ...node.data.props } } })
    .toNode();

  actions.add(freshNode, parentId, index + 1);
}
