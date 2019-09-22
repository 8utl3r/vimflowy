/*
	These keybindings do not call e.preventDefault() && e.stopPropagation()	implicitly.
	You'll have to decide when and were to do that in each binding.
*/

const transparentActionMap = 
{
	[Mode.NORMAL]: 
	{
	  'ctrl-k': e => 
	  {
	    focusPreJumpToItemMenu = WF.focusedItem();
	    goToInsertMode();
	  },
	  'ctrl-Dead': e => 
	  {
	    focusPreJumpToItemMenu = WF.focusedItem();
	    goToInsertMode();
	  },
	  'alt-Enter': e => 
	  {
	    var focusedItem = WF.focusedItem();
	    if(!focusedItem)
	      return;

	    focusedItem = WF.getItemById(focusedItem.getId());

	    const element = focusedItem.getElement();
	    const firstContentLink = element.getElementsByClassName('contentLink')[0]; 
	    if(firstContentLink)
	    {
	      const contentHref = firstContentLink.getAttribute("href");
	      // console.log("href: " + contentHref);
	      const strippedHref = contentHref.replace(/(^\w+:|^)\/\//, '');
	      // console.log("Stripped href: " + strippedHref);
	      const focusedItemName = focusedItem.getNameInPlainText();
	      // console.log("Name; " + focusedItemName);
	      const focusedItemNote = focusedItem.getNoteInPlainText();
	      // console.log("Note; " + focusedItemNote);
	      if(focusedItemName.includes(strippedHref) || focusedItemNote.includes(strippedHref))
	      {
	        var win = window.open(contentHref, '_blank');
	        win.focus();
	      }
	    }

	  },
	  Enter: e => 
	  {
	    const focusedItem = WF.focusedItem();
	    if(e.shiftKey && focusedItem)
	    {
	      goToInsertMode();
	      return;
	    }

	    PrevEnterItem = WF.currentItem();
	    if(focusedItem)
	    {
	      // console.log("transparent Enter (NORMAL) valid focus");
	      e.preventDefault()
	      e.stopPropagation()
	      // WF.zoomIn(focusedItem);
	      WF.zoomTo(focusedItem);
	      WF.editItemName(focusedItem);
	    }
	    else
	    {
	      // WF.zoomIn(WF.currentItem());
	      WF.zoomTo(WF.currentItem());
	      WF.editItemName(WF.currentItem());
		}

	  },
	  Backspace: e => 
	  {
	    e.preventDefault()
	    e.stopPropagation()
	    if(PrevEnterItem)
	    {
	      // console.log("trying to zoom in on prev item");
	      // console.log(PrevEnterItem);
	      // WF.zoomIn(PrevEnterItem);
	      WF.zoomTo(PrevEnterItem);
	    }
	  },
	  'dd': e => 
	  {
	    deleteSelectedItems(e);
	    e.preventDefault()
	    e.stopPropagation()
	  },
	  Escape: e => 
	  {
	    if(WF.focusedItem())
	    {
	        // console.log("transparent Escape (NORMAL)");
	        const selection = WF.getSelection();
	        if (selection !== undefined && selection.length != 0)
	        {
	          VisualSelectionBuffer = [];
	          WF.setSelection([]);
	        }

	        e.preventDefault()
	        e.stopPropagation()
	    }

	    WF.hideMessage();
	    WF.hideDialog();
	    goToNormalMode();
	  },
	  'g': e => 
	  {
	    const focusedItem = WF.focusedItem();
	    if(!focusedItem)
	      return;

	    const focusedItemParent = focusedItem.getParent();
	    if(!focusedItemParent)
	      return;

	    const currentOffset = state.get().anchorOffset

	    const bIsParentHomeRoot = WF.rootItem().equals(focusedItem.getParent()); 
	    if(bIsParentHomeRoot)
	    {
	      const visibleChildren = WF.currentItem().getVisibleChildren();
	      if (visibleChildren !== undefined && visibleChildren.length != 0) 
	      {
	        WF.editItemName(visibleChildren[0]);
	      }
	      else
	      {
	        WF.editItemName(focusedItemParent);
	      }
	    }
	    else
	    {
	      WF.editItemName(focusedItemParent);
	    }

	    event.preventDefault()
	    event.stopPropagation()

	    setCursorAt(currentOffset);
	  },
	  'G': e => 
	  {
	    const visibleChildren = WF.currentItem().getVisibleChildren();
	    if (visibleChildren !== undefined && visibleChildren.length != 0) 
	    {
	      const currentOffset = state.get().anchorOffset

	      if(WF.focusedItem().equals(WF.currentItem()))
	        WF.editItemName(visibleChildren[0]);

	      const finalKid = visibleChildren[visibleChildren.length - 1];
	      WF.editItemName(finalKid);

	      setCursorAt(currentOffset);

	      event.preventDefault()
	      event.stopPropagation()

	      if(WF.focusedItem().equals(finalKid))
	        return;

	      var focusedItem = WF.focusedItem();
	      if(focusedItem.isExpanded() && WF.currentSearchQuery() === null)
	        WF.collapseItem(focusedItem);

	      var i = visibleChildren.length; 
	      while(i--)
	      {

	        if(focusedItem.isExpanded() && WF.currentSearchQuery() === null)
	          WF.collapseItem(focusedItem);

	        const index = visibleChildren.length - i - 1;
	        WF.editItemName(visibleChildren[index]);
	        focusedItem = WF.focusedItem();
	        setCursorAt(currentOffset);
	      }

	    }
	  },
	  'gg': e => 
	  {
	    const currentOffset = state.get().anchorOffset
	    const bIsCurrentItemHomeRoot = WF.rootItem().equals(WF.currentItem()); 
	    if(bIsCurrentItemHomeRoot)
	    {
	      const visibleChildren = WF.currentItem().getVisibleChildren();
	      if (visibleChildren !== undefined && visibleChildren.length != 0) 
	      {
	        WF.editItemName(visibleChildren[0]);
	      }
	      else
	      {
	        WF.editItemName(WF.currentItem());
	      }
	    }
	    else
	    {
	      WF.editItemName(WF.currentItem());
	    }

	    event.preventDefault();
	    event.stopPropagation();

	    setCursorAt(currentOffset);
	  },
	  'dw': e => 
	  {
	    deleteWord(e, true);
	  },
	  'de': e => 
	  {
	    deleteWord(e, false);
	  },
	  'd$': e => 
	  {
	    deleteUntilLineEnd(e);
	  },
	  'dr': e => 
	  {
	    deleteUntilLineEnd(e);
	  },
	  '<': e => 
	  {
	    enterVisualMode();
	    outdentSelection(e);
	    ExitVisualMode();
	    event.preventDefault()
	    event.stopPropagation()
	  },
	  '>': e => 
	  {
	    enterVisualMode();
	    indentSelection(e);
	    ExitVisualMode();
	    event.preventDefault()
	    event.stopPropagation()
	  },
	  Tab: e => 
	  {
	    if(e.shiftKey)
	      outdentSelection(e);
	    else
	      indentSelection(e);
	  },
	  'ctrl- ': e => 
	  {
	    toggleExpandAll(e);
	  }
	},
	[Mode.VISUAL]: 
	{
	  'ctrl-Enter': e => 
	  {
		  toggleCompletedOnSelection(e);
		  ExitVisualMode();
	  },
	  'ctrl- ': e => 
	  {
	    toggleExpandAll(e);
	  },
	  '<': e => 
	  {
	    outdentSelection(e);
	    event.preventDefault()
	    event.stopPropagation()
	    ExitVisualMode();
	  },
	  '>': e => 
	  {
	    indentSelection(e);
	    event.preventDefault()
	    event.stopPropagation()
	    ExitVisualMode();
	  },
	  Tab: e => 
	  {
	    if(e.shiftKey)
	      outdentSelection(e);
	    else
	      indentSelection(e);
	    ExitVisualMode();
	  },
	  'ctrl-k': e => 
	  {
	    ExitVisualMode();
	    focusPreJumpToItemMenu = WF.focusedItem();
	    goToInsertMode();
	  },
	  'ctrl-Dead': e => 
	  {
	    ExitVisualMode();
	    focusPreJumpToItemMenu = WF.focusedItem();
	    goToInsertMode();
	  },
	  Escape: e => 
	  {
	    if(WF.focusedItem())
	    {
	        const selection = WF.getSelection();
	        if (selection !== undefined && selection.length != 0)
	        {
	          VisualSelectionBuffer = [];
	          WF.setSelection([]);
	        }

	        e.preventDefault()
	        e.stopPropagation()
	    }

	    InitialSelectionItem = null;

	    WF.hideMessage();
	    WF.hideDialog();
		goToNormalMode();
	  }
	},
	[Mode.INSERT]: 
	{
	  Escape: e =>
	  {
	    // prevent it from focusing on the search bar
	    e.preventDefault()

	    if(!WF.focusedItem())
	    {
	      if(focusPreJumpToItemMenu)
	      {
	        WF.editItemName(focusPreJumpToItemMenu);
	        focusPreJumpToItemMenu = null;
	      }

	      if(!WF.focusedItem())
	        WF.editItemName(WF.currentItem());
	    }
	    else
	    {
	      // console.log("stopping prop");
	      e.stopPropagation()
	    }

	    goToNormalMode();
	  },
	  'jk': e => 
	  {
	    // guard against accidently pressing jk while in the menu 
	    if(!WF.focusedItem())
	      return;

	    goToNormalMode();

	    // remove j from under the cursor
	    const currentOffset = state.get().anchorOffset
	    WF.insertText("");
	    setCursorAt(currentOffset);
	    goToInsertMode();
	    goToNormalMode();
	    goToNormalMode();
	    setCursorAt(currentOffset);

	    // prevent k from being typed out.
	    event.preventDefault();
	  },
	  'ctrl-k': e => 
	  {
	    // console.log("insert ctrl k");
	    focusPreJumpToItemMenu = WF.focusedItem();
	    // goToNormalMode();
	    goToInsertMode();
	  },
	  'ctrl-Dead': e => 
	  {
	    // console.log("insert ctrl dead");
	    focusPreJumpToItemMenu = WF.focusedItem();
	    // goToNormalMode();
	    goToInsertMode();
	  },
	  'Enter': e => 
	  {
	    // we are using the JumpToMenu to jump to the 
	    // item which we are already standing on.
	    // this means that "locationChanged" won't fire...
	    // so we'll handle it here for now.. 
	    if(!WF.focusedItem() && WF.currentItem())
	    {

	      if(focusPreJumpToItemMenu)
	      {
	        WF.editItemName(focusPreJumpToItemMenu);
	        focusPreJumpToItemMenu = null;
	      }

	      if(!WF.focusedItem())
	        WF.editItemName(WF.currentItem());

	      goToNormalMode();
	      event.preventDefault();

	      requestAnimationFrame(fixFocus);

	      // console.log("exiting the bullet menu");
	    }

	    // console.log("(insert) Enter: focused item: " + WF.focusedItem().getNameInPlainText());
	    // console.log("(insert) Enter: current item: " + WF.currentItem().getNameInPlainText());

	  }
	}
}
