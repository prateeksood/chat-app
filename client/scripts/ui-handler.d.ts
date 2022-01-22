interface ComponentListAction<DataType> extends DataListAction<DataType>{
  "added-multiple"(items:DataType[],index:Number):void
}

class Component<ElementType> extends UIHandler.Component<ElementType>{}
class ComponentList<DataType> extends UIHandler.ComponentList<DataType>{}

class UIHandler{
  list:{
    [id:string]: ComponentList<Component>;
    chatItems: ComponentList<ChatItem>;
  }
}

interface ComponentLists{
  chatItems:ComponentList<ChatItem>
}