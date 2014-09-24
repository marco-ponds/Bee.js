
/*
	BEE.JS
	Marco Stagni.
*/
//default config

/******************************
	TREE Class
******************************/
function BEE() {
	this.options = undefined;
	this.nodes = [];
	this.size = 0;
	this.hasRoot = false;
	this._idPool = [];
}

//lib info
BEE.version = '0.1';
BEE.authors = [{
	name : "Marco Stagni",
	website : "http://marcostagni.com"
}];

//static values
BEE.MAX_CHILDREN_COUNT = 2; //every node must have max 2 children
BEE.MAX_PARENTS_COUNT = 1; //every node must have max 1 parent
BEE.MAX_ID_SIZE = 12; //max size of id string.
BEE.MAX_ROOT_NUMBER = 1; //max one root per BEE.

//error messages
BEE.VALID_BEE = "Please use a valid BEE object.";
BEE.UNTOUCHABLE = "Untouchable value. Get away.";
BEE.VALID_BRANCH = "Please specify a valid branch.";
BEE.NO_MORE_CHILDREN = "No more children allowed for this node.";
BEE.NO_MORE_PARENTS = "This node already have a parent.";

BEE.ERROR_NO_LEAVES = "Sorry, something wrong in your BEE. There are no leaves :(";
BEE.ERROR_NO_PARENTS = "Sorry, something wrong in your BEE. There are no leaves :(";
BEE.ERROR_STRANGE_ROOTS = "Sorry, something wrong in your BEE. Strange number of root nodes";
BEE.ERROR_ALREADY_LEFT = "Sorry, this node already have a left branch.";
BEE.ERROR_ALREADY_RIGHT = "Sorry, this node already have a right branch.";

BEE.BAD_ARGUMENTS = "BAD ARGUMENTS, please check them.";

//creating a new node from BEE
//node can store almost everything
/*
	value = {
		name : "marco",
		surname : "stagni",
		telephone : 12345,
		yolo : [1,2,3,4],
		yup : {
			a : 1,
			b : "a",
			...and so on.
		}
	}

	the value object will be stored in "data" field of your node.
*/
BEE.prototype.createNode = function(value) {
	var a = new Node({
		tree : this,
		data : value,
	});
	return a;
};

//returning all leaves
BEE.prototype.getAllLeaves = function() {
	var _toReturn = [];
	for (var i in this.nodes) {
		if (this.nodes[i]._isLeaf) {
			_toReturn.push(this.nodes[i]);
		}
	}
	if (_toReturn.length == 0) {
		throw BEE.ERROR_NO_LEAVES;
	}
	return _toReturn;
};

//returning root node
BEE.prototype.getRootNode = function() {
	var _toReturn = [];
	for (var i in this.nodes) {
		if (this.nodes[i]._isRoot) {
			_toReturn.push(this.nodes[i]);
		}
	}
	if (_toReturn.length != 1) {
		throw BEE.ERROR_STRANGE_ROOTS;
	}
	return _toReturn[0];
};

//returning all parents
BEE.prototype.getAllParents = function() {
	var _toReturn = [];
	for (var i in this.nodes) {
		if (this.nodes[i]._isParent) {
			_toReturn.push(this.nodes[i]);
		}
	}
	if (_toReturn.length == 0) {
		throw BEE.ERROR_NO_PARENTS;
	}
	return _toReturn;
};

//returning path to a single leaf
BEE.prototype.getPath = function(leaf, root) {
	var _toReturn = [], p, l;
	//this._getPath(leaf, root, root.leftWeight, _toReturn);
	_toReturn.push({
		n : leaf,
		w : undefined
	});
	p = leaf.parent;
	l = leaf;
	while (p) {
		var weight = (p.leftBranch._id == l._id) ? p.leftWeight : p.rightWeight;
		_toReturn.push({
			n : p,
			w : weight
		});
		l = p;
		p = p.parent;
	}
	return _toReturn.reverse(); //path must be from root to leaf
};

//printing the whole tree
/*
	must specify strategy
	strategy : "post", "pre", "default"
*/

BEE.prototype.each = function (callback, strategy) {
	//callback method will be called for each element
	var count = 0;
	if (!(typeof callback == "function")) {
		throw BEE.BAD_ARGUMENTS;
	}	if (strategy == "post") {
		_postEach(callback, count, this.getRootNode());
	} else if (strategy == "pre") {
		_preEach(callback, count, this.getRootNode());
	} else {
		_defEach(callback, count, this.getRootNode());
	}
};

function _preEach (callback, count, node) {
	if (node) {
		var c = count+1;
		callback(node, c);
		_preEach(callback, count, node.leftBranch);
		_preEach(callback, count, node.rightBranch);
	}
}

function _postEach (callback, count, node) {
	if (node) {
		_postEach(callback, count, node.leftBranch);
		_postEach(callback, count, node.rightBranch);
		var c = count+1;
		callback(node, c);
	}
}

function _defEach (callback, count, node) {
	if (node) {
		_defEach(callback, count, node.leftBranch);
		var c = count+1;
		callback(node, c);
		_defEach(callback, count, node.rightBranch);
	}
}

//check if node is member of the selected BEE
//we need a compare method to
//strategy means the order of BEE parsing
/*
	strategy : "LTR/ltr" //left to right
	strategy : "RTL/rtl" //right to left

	compare : function (dataA, dataB) {
		return dataA.param == dataB.param;
	}
*/

BEE.prototype.has = function(node, compare, strategy) {
	//calling inner _has for recursive call
	if (!(typeof compare == "function")) {
		throw BEE.BAD_ARGUMENTS;
	}
	var flag;
	if (!strategy) {
		flag = _hasLTR(node, this.getRootNode(), compare);
	} else {
		_s = strategy.toLowerCase();
		if (_s == "ltr") {
			flag = _hasLTR(node, this.getRootNode(), compare);
		} else if (_s == "rtl") {
			flag = _hasRTL(node, this.getRootNode(), compare);
		} else {
			throw BEE.BAD_ARGUMENTS;
		}
	}
	return flag;
};

function _hasLTR(node, tree, compare) {
	if (!tree) return false;
	else {
		if (compare(node.data, tree.data)){
			return true;
		}
		else{
			return (_hasLTR(e,tree.leftBranch) || _hasLTR(e,tree.rightBranch));
		}
	}
}

function _hasRTL(node, tree, compare) {
	if (!tree) return false;
	else {
		if (compare(node.data, tree.data)){
			return true; 
		}
		else{
			return (_hasRTL(e,tree.rightBranch) || _hasRTL(e,tree.leftBranch));
		}
	}
}

//in case we have a ordered binary tree, we need to use orderedHas
/*
	compare function must implement a comparing system
	must be a function which checks if node A and node B are equals.

	compare : function(a,b) {
		if (a<b) return -1;
		if (a>b) return 1;
		else return 0;
	}
*/
BEE.prototype.orderedHas = function(node, compare) {
	return _orderedIns(node, this.getRootNode(), compare);
};

function _orderedHas(node, root, compare) {
	if (!root) {
		return false;
	} else {
		if (compare(node.data, root.data) == 0) return true;
		else if (compare(node.data, root.data) < 0) {
			return _orderedHas(node, root.leftBranch);
		} else {
			return _orderedHas(node, root.rightBranch);
		}
	}
}

//method to get BEE height
BEE.prototype.height = function() {
	var h = _height(this.getRootNode());
	return h;
};

function height(root) {
   if(!root)
       return 0;
   return 1+ Math.max(_height(root.leftBranch), _height(root.rightBranch));
}


/*
	BINARY TREES ORDERED INSERT
*/

//ordered insert inside tree
/*
	you need to provide a valid compare function
	compare : function(a,b) {
		if (a<b) return -1;
		if (a>b) return 1;
		else return 0;
	}
*/
BEE.prototype.orderedIns = function(node, compare) {
	try {	
		_orderedIns(node, this.getRootNode(), compare);
	} catch (e) {
		console.log("Something bad happened in ordIns");
		return false;
	}
};

function _orderedIns(node, root, compare) {
	if (!root) {
		return buildNode(data,undefined,undefined);
	} else {
		if ((compare(node.data, root.data) < 0) || (compare(node.data, root.data) == 0)) {
			root.leftBranch = _orderedIns(node, root.leftBranch);
		} else {
			root.rightBranch = _orderedIns(node, root.rightBranch);
		}
	}
	return root;
}

function buildNode(data, left, right) {
	var node = this.createNode(data);
	node.addLeaf(left, {branch:"left"});
	node.addLeaf(right, {branch:"right"});
	return node;
}

BEE.prototype.buildNode = function (data, left, right) {
	//building a new node with left and right branch 
	var node = this.createNode(data);
	node.addLeaf(left, {branch:"left"});
	node.addLeaf(right, {branch:"right"});
	return node;
};
/******************************
	Node Class
******************************/
//constructor
function Node(options) {
	//checking if options.BEE is a valid BEE object.
	if (options.tree && options.tree instanceof BEE) {
		this.tree = options.tree;
	} else {
		throw BEE.VALID_BEE;
	}
	//creating a valid id
	var tmp = Math.random().toString(BEE.MAX_ID_SIZE).slice(2);
	while (this.tree._idPool.indexOf(tmp) > -1) {
		tmp = Math.random().toString(BEE.MAX_ID_SIZE).slice(2);
	}
	this.tree._idPool.push(tmp);
	this._id = tmp;
	//setting _id property as untouchable
	Object.defineProperty(this, "_id", {
		set : function() {
			throw BEE.UNTOUCHABLE;
		},
		get : function() {
			return tmp;
		}
	});
	
	//this _id is automatically created, you can not change it.

	//getting data from arguments
	this.data = options.data;

	//updating tree with new node.
	this.tree.size += 1;
	this.tree.nodes.push(this);

	this.leftBranch = undefined; //storing left node id 
	this.rightBranch = undefined; //storing right node id

	this.rightWeight = undefined;
	this.leftWeight = undefined;

	//flags
	this._isRoot = false;
	this._isLeaf = false;
	this._isParent = false;

	//counters
	this.children = 0;
	this.parents = 0;

	//reference to parent 
	//this is still undefined, when this node is the root node
	this.parent = undefined;
}

//Setting flags.
Node.prototype.setRoot = function(value){
	this._isRoot = value;
};

Node.prototype.setParent = function(value){
	this._isParent = value;
};

Node.prototype.setLeaf = function(value){
	this._isLeaf = value;
};

//Node update function, node automatically updates its state 
Node.prototype.update = function() {
	//checking if leaft, parent or root node
	if (this.children == 0) {
		//this node doesn't have children.
		if (this.parents == 0) {
			//children == 0, parents == 0, it's a root, or a stupid node
			this.setLeaf(false);
			this.setRoot(true);
			this.setParent(false);
		} else {
			//children == 0, parents > 0, it's a leaf
			this.setLeaf(true);
			this.setRoot(false);
			this.setParent(false);
		}
	} else {
		//if this node has children, it's a parent
		if (this.parents == 0) {
			//no parents, childrens > 0, it's root.
			this.setLeaf(false);
			this.setRoot(true);
			this.setParent(true);
		} else {
			this.setLeaf(false);
			this.setRoot(false);
			this.setParent(true);
		}
	}
};

//Add new leaf
//when a node receive a leaf, it automatically becomes a parent
/*
	options = {
		branch : left | right,
		weights : {
			r : 1,
			l : 0
		}
	}
*/
Node.prototype.addLeaf = function(node,options) {
	if (this.children+1 > BEE.MAX_CHILDREN_COUNT) {
		throw BEE.NO_MORE_CHILDREN;
	} 
	//adding branch to this node
	//Settting weight
	if (!options.branch) {
		throw BEE.BAD_ARGUMENTS;
	}
	if (options.branch == "left") {
		if (!this.leftBranch) {
			// i can add a new leaf only if there aren't old leaves.
			this.leftBranch = node;
			if (!options.weights) {
				this.leftWeight = 0;
			} else {
				this.leftWeight = options.weights.l ? options.weights.l : 0;
			}
		} else {
			throw BEE.ERROR_ALREADY_LEFT;
		}
	} else if (options.branch == "right") {
		if (!this.rightBranch) {
			this.rightBranch = node;
			if (!options.weights) {
				this.rightWeight = 1;
			} else {
				this.rightWeight = options.weights.r ? options.weights.r : 1;
			}
		} else {
			throw BEE.ERROR_ALREADY_RIGHT;
		}
	} else {
		throw BEE.VALID_BRANCH;
	}

	//increasing children count
	this.children +=1;
	node.parent = this;
	node.parents = 1; 
	//updating node status
	this.update();
	node.update();
};

//adding new parent to this node. select branch for the parent node
/*
	options = {
		branch : left | right,
		weights : {
			r : 1,
			l : 0
		}
	}
*/

Node.prototype.addParent = function(node, options) {
	if (this.parents+1 > BEE.MAX_PARENTS_COUNT) {
		throw BEE.NO_MORE_PARENTS;
	}
	//checking if node can be our parent
	if (node.children+1 > BEE.MAX_CHILDREN_COUNT) {
		throw BEE.NO_MORE_CHILDREN;
	}
	//if we are here, we are allowed to proceed
	node.addLeaf(this, options);
};
