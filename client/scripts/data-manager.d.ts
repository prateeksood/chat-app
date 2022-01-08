interface DataListAction<DataType>{
  add(item:DataType,index:Number):void,
  remove(index:Number,item:DataType):void,
  update(index:Number,new_item:DataType):void,
  select(index:Number):void,
  unselect(index:Number):void,
  cursorMove(old_index:Number,new_index:Number):void
}
interface DataGroupAction<DataType>{
  add(item:DataType,id:String):void,
  remove(id:String):void,
  update(id:String,new_item:DataType):void,
  select(item:DataType,id:String,extra:{triggeredBy:DataType}):void,
  unselect(item:DataType,id:String,extra:{triggeredBy:DataType}):void
}