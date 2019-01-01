//ItemCtrl
const ItemCtrl = (function(){
  const Item = function(id,name,calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  } 

  const data = {
    items:[{id:0,name:'pizza',calories:500},{id:1,name:'chicken',calories:700},{id:2,name:'sandwich',calories:400}],
    currentItem :null,
    totalCalories: 0
  }
  return{
    logData(){
      return data
    },
    getItems(){
      return data.items;
    },
    findAndSetToCurrentItem(id){
      const item = data.items.find(item => item.id === id);
      data.currentItem = item;
      return data.currentItem;
    },
    updateItem(name,calories){
      const index = data.items.findIndex(item => item.id === data.currentItem.id);
      const updateItem = data.items[index];
      updateItem.name = name;
      updateItem.calories = parseInt(calories);
      return updateItem;
    },
    getTotalCalories(){
      let total = 0;
      data.items.forEach(item => {
        total += item.calories 
      });
      data.totalCalories = total;
      return data.totalCalories;
    },
    addItem(name,calories){
      let ID;
      if(data.items.length > 0){
        ID = data.items[data.items.length -1].id +1;
      }else{
        ID = 0;
      }
      const caloriesInt = parseInt(calories);
      const newItem = new Item(ID,name,caloriesInt);
      data.items.push(newItem);
      return newItem;
    },
    deleteItem(){
      const deleteId = data.currentItem.id;
      const deleteIndex = data.items.findIndex(item => item.id === deleteId);
      data.items.splice(deleteIndex,1); 
      return deleteId;
    },
    deleteAllItems(){
      data.items.length = 0;
    }
  }
})();

//UICtrl
const UICtrl = (function(){
  const UISelectors = {
    itemList : '#item-list',
    listItems:'#item-list li',
    addBtn:".add-btn",
    updateBtn:".update-btn",
    deleteBtn:".delete-btn",
    backBtn:".back-btn",
    clearBtn:'.clear-btn',
    itemNameInput:'#item-name',
    itemCaloriesInput:'#item-calories',
    totalCalories:'.total-calories'
  }
  return{
    populateItemList(items){
      let html = '';
      items.forEach(item => {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="edit-item secondary-content">
          <i class="fa fa-pencil"></i>
        </a>
      </li>`
      });
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    addListItem(item){
      document.querySelector(UISelectors.itemList).style.display = 'block';
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`;
      li.innerHTML = ` <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="edit-item secondary-content">
        <i class="fa fa-pencil"></i>
      </a>`
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);
    },
    updateListItem(item){
      let listItems = document.querySelectorAll(UISelectors.listItems)
      listItems.forEach(listItem => {
        const itemID = listItem.getAttribute('id');
        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = ` <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="edit-item secondary-content">
            <i class="fa fa-pencil"></i>
          </a>`
        }
      });
    },
    deleteListItem(deleteId){
      const itemID = `#item-${deleteId}`;
      document.querySelector(itemID).remove();
    },
    deleteAllItems(){
      const list = document.querySelectorAll(UISelectors.listItems);
      list.forEach(item => item.remove());
    },
    addItemToForm(name,calories){
      document.querySelector(UISelectors.itemNameInput).value = name;
      document.querySelector(UISelectors.itemCaloriesInput).value = calories;
      this.showEditState();
    },
    clearInput(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    clearEditState(){
      this.clearInput();
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState(){
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    hideList(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    getUISelectors(){
      return UISelectors;
    },
    getItemInput(){
      return{
        name:document.querySelector(UISelectors.itemNameInput).value.trim(),
        calories:document.querySelector(UISelectors.itemCaloriesInput).value.trim()
      }
    }
  }
})();

//App

const App= (function(ItemCtrl,UICtrl){

  const UISelectors = UICtrl.getUISelectors();

  const loadEventListeners = function(){
    document.addEventListener('keypress',(e) =>{
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    });
    document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
    document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);
    document.querySelector(UISelectors.backBtn).addEventListener('click',backToNormalState);
    document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);
    document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllItemsSubmit);
  }
  function itemAddSubmit(e){
    e.preventDefault();
    console.log('add');
    const item = UICtrl.getItemInput();
    if(item.name === '' || item.calories === ''){
      alert('please enter your fields');
    }else{
      const newItem = ItemCtrl.addItem(item.name,item.calories);
      UICtrl.addListItem(newItem)
      UICtrl.clearInput();
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);
    }
  }

  function itemEditClick(e){
    if(e.target.parentElement.classList.contains('edit-item')){
      console.log('edit');
      const listId = e.target.parentElement.parentElement.id;
      const listIdArr = listId.split('-');
      const id = parseInt(listIdArr[1])
      const currentItem = ItemCtrl.findAndSetToCurrentItem(id);
      UICtrl.addItemToForm(currentItem.name,currentItem.calories);
    }
  }

  function itemUpdateSubmit(e){
    console.log('update');
    e.preventDefault();   
    const item = UICtrl.getItemInput();
    const updatedItem = ItemCtrl.updateItem(item.name,item.calories);
    UICtrl.updateListItem(updatedItem);
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);
    UICtrl.clearEditState();
  };

  function backToNormalState(e){
    e.preventDefault();
    UICtrl.clearEditState();
  };

  function itemDeleteSubmit(e){
    e.preventDefault();
    console.log('delete');
    const deleteId =  ItemCtrl.deleteItem();
    UICtrl.deleteListItem(deleteId);;
    UICtrl.clearEditState();
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);
  }

  function clearAllItemsSubmit(e){
    e.preventDefault();
    ItemCtrl.deleteAllItems();
    UICtrl.deleteAllItems();
  }

  return{
    init(){
      console.log('init app');
      UICtrl.clearEditState(); 
      //fetch items from data-structure
      const items = ItemCtrl.getItems();
      //populate list with items
      if(items.length === 0){
        UICtrl.hideList();
      }
      else{
      UICtrl.populateItemList(items);
      }
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);

      loadEventListeners();
    }

  }

})(ItemCtrl,UICtrl);

App.init();