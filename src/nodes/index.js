import ModelNode from './ModelNode';
import ProviderNode from './ProviderNode';
import ToolNode from './ToolNode';
import BuilderNode from './BuilderNode';
import BlankNode from './BlankNode';
import SectionNode from './SectionNode';

export const nodeTypes = {
  model: ModelNode,
  provider: ProviderNode,
  tool: ToolNode,
  builder: BuilderNode,
  blank: BlankNode,
  section: SectionNode,
};
