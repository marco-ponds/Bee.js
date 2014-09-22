#BEE.JS

----
BEE stands for Binary trEE. This is just a small library to help you handling Binary Trees: there's no need of external frameworks (such as JQuery, or Mootools), Bee.js is completely written in vanilla javascript and it's ready to go just after you download it.

Bee.js is available both in unminified (~7Kb) and minified version (~5Kb).

current version : 0.1

####USAGE

First thing first, include Bee.js in your html page. Pretty easy.

```html
	<script type="text/javascript" src="bee.js"/>
```

1) Create a Tree Object

```javascript
	var tree = new Tree();
```

You are now able to create nodes for your tree. There are three types of nodes: Leaf, Parent and Root. 

2) Create a Node and attach a Leaf or a Parent

```javascript
	//creating a new Node
	var node = tree.createNode(data);

	/*
		Your node is able to store your data, just pass the right parameter to the constructor.
		You will be able to access your stored informations just using:

			node.data
	*/
```

So, now you have a nice Node with your data stored. You can now decide to attach a new Leaf to it, or add a new Parent. There are two functions to perform this operations:

3) Adding a new Leaf

Adding a new Leaf to your node is really easy. Just create a new node and attach it to the old one using this simple piece of code. You have to specify which branch your child node should use, and remember: only two children are allowed for each parent. When you attach a node to another one, the first becomes a Leaf, while the second one becomes a Parent.

```javascript
	var parent = tree.createNode(dataParent);
	var leaf = tree.createNode(dataChild);
	var options = {
		branch : "right" //or "left"
	};
	parent.addLeaf(leaf, options);
```

4) Adding a parent to a node

Adding a Parent to a node is just as simple as adding a new Leaf. You have to use the following piece of code, and remember to specify which branch your child node must be attached to.

```javascript
	var parent = tree.createNode(dataParent);
	var leaf = tree.createNode(dataChild);
	var options = {
		branch : "right" //or "left"
	};
	leaf.addParent(parent, options);
```

----

####Useful methods.

The tree object gives you a few useful methods to handle your tree.

1) Get all Leaves

```javascript
	var leaves = tree.getAllLeaves();
```	

This method will give you an array with every leaf of your tree.

2) Get all Parents

```javascript
	var parents = tree.getAllParents();
```	

This method will give you an array with every parent of your tree.

3) Get Root Node

```javascript
	var root = tree.getRootNode();
```

This method will give you the Root Node

4) Get Path

```javascript
	var leaf = tree.getAllLeaves()[0];
	var root = tree.getRootNode();

	var path = tree.getPath(leaf,root);
```

This method will return an array with every Node of the Path from the Root Node to the Leaf Node.

THIS LIBRARY IS STILL A WORK IN PROGRESS. PLEASE USE IT AT YOUR OWN RISK.

----

Proudly developed by Marco Stagni. http://marcostagni.com