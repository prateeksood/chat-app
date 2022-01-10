interface ComponentListAction<DataType> extends DataListAction<DataType>{
  "added-multiple"(items:DataType[],index:Number):void
}