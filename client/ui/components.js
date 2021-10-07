class Container extends UIHandler.Component{
  constructor(id){
    const element=DOM.create("div",{
      class:"container"
    });
    super(id,element);
  }
};