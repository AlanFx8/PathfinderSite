//This class represents a node as an object - not as a react component
class NodeData {
    //Constructor
    constructor(y, x, bgx, bgy){
        this.y = y;
        this.x = x;
        this.isWall = false;
        this.isStartNode = false;
        this.isStartNodePreview = false; /*For dragging start-node*/
        this.isEndNode = false;
        this.isEndNodePreview = false; /*For dragging end-node*/
        this.isError = false;
        this.isChecked = false;
        this.local_distance = Infinity;
        this.global_distance = Infinity;
        this.neighbors = [];
        this.previousNode = null;
        this.bgx = bgx;
        this.bgy = bgy;
        this.wall_bgx = 0;
    }

    //Methods
    StartNodeOn = () => {
        this.isWall = false;
        this.isStartNodePreview  = false;
        this.isStartNode = true;
    }

    StartNodeOff = () => this.isStartNode = false;

    StartNodePreviewOn = () => this.isStartNodePreview = true;

    StartNodePreviewOff = () => this.isStartNodePreview = false;

    EndNodeOn = () => {
        this.isWall = false;
        this.isEndNodePreview = false;
        this.isEndNode = true;
    }

    EndNodeOff = () => this.isEndNode = false;

    EndNodePreviewOn = () => this.isEndNodePreview = true;

    EndNodePreviewOff = () => this.isEndNodePreview = false;

    ErrorOn = () => this.isError = true;

    ErrorOff = () => this.isError = false;

    WallOn = () => {
        if (this.isStartNode || this.isEndNode) return;
        this.isChecked = false;
        this.wall_bgx = Math.floor((Math.random() * 4));
        this.isWall = true;
    }

    WallOff = () => this.isWall = false;

    ToggleWall = () => {
        if (!this.isWall){
            this.WallOn();
        }
        else {
            this.WallOff();
        }
    }
    
    CheckOn = () => this.isChecked = true;
}

module.exports = NodeData;