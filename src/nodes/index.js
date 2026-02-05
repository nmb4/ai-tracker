import ModelNode from './ModelNode';
import ProviderNode from './ProviderNode';
import ToolNode from './ToolNode';
import BlankNode from './BlankNode';

export const nodeTypes = {
  model: ModelNode,
  provider: ProviderNode,
  tool: ToolNode,
  blank: BlankNode,
};
