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
  container:{
    [id:string]: Component<HTMLElement>,
    main: Component<HTMLDivElement>,
    chat: Component<HTMLDivElement>,
    auth: Component<HTMLDivElement>,
    loader: Component<HTMLDivElement>
  }
}

interface ComponentLists{
  chatItems:ComponentList<ChatItem>
}