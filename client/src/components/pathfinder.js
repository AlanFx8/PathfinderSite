import React from 'react';
import PathfinderHeader from './pathfinder-header';
import PathfinderBody from './pathfinder-body';
import PathfinderFooter from './pathfinder-footer';
import NodeData from '../node/node-data';
import Bee from './bee';
import NodeController from '../classes/node-controller';
import { DIJKSTRA, A_STAR } from '../types/algorithms-types';
import { MANHATTAN_DISTANCE } from '../types/heuristic-types';
import Dijkstra from '../algorithms/dijkstra';
import AStar from '../algorithms/astar';
import './css/reset.css';
import './css/pathfinder.css';
import './css/node.css';

export default class Pathfinder extends React.Component {
    ///CONSTRUCTOR///
    constructor(props){
        super(props);

        this.state = {
            nodes: [],
            showGrid: false,
            isAnimatingPath: false,
            isDraggingMouse: false,
            startNode: null,
            endNode: null,
            isDragingStartNode: false,
            isDragingEndNode: false,
            algorithmType: DIJKSTRA,
            heuristicType: MANHATTAN_DISTANCE,
            nodeController: new NodeController()
        }
    }

    ///START///
    componentDidMount(){
        this._initialize();
    }

    _initialize = () => {
        let { nodes, startNode, endNode } = this.state;
        const ROW_COUNT = 14 * 2; //16px * 14 = 224px
        const COL_COUNT = 16 * 2; //16px * 16 = 256px

        //First loop - create all the nodes
        for (let rowCount = 0; rowCount < ROW_COUNT; rowCount++){
            const newRow = [];
            for (let colCount = 0; colCount < COL_COUNT; colCount++){
                const bgx = Math.floor((Math.random() * 4)) * 16;
                const bgy = Math.floor((Math.random() * 4)) * 16;
                newRow.push(new NodeData(rowCount, colCount, bgx, bgy));
            }
            nodes.push(newRow);
        }
        
        //Second loop - set neighbors since they never change
        for (let y = 0; y < ROW_COUNT; y++){
            for (let x = 0; x < COL_COUNT; x++){
                const node = nodes[y][x];                
                if (y > 0) node.neighbors.push(nodes[y - 1][x]);
                if (y < ROW_COUNT - 1) node.neighbors.push(nodes[y + 1][x]);
                if (x > 0)  node.neighbors.push(nodes[y][x - 1]);
                if (x < COL_COUNT - 1) node.neighbors.push(nodes[y][x + 1]);
            }
        }

        //Set start and end nodes
        nodes[1][1].StartNodeOn();
        startNode = nodes[1][1];
        nodes[ROW_COUNT-2][COL_COUNT-2].EndNodeOn();
        endNode = nodes[ROW_COUNT-2][COL_COUNT-2];

        //Finish
        this.setState({ nodes, startNode, endNode });
        setTimeout(() => {
            this.setBeeToPos(this.state.startNode);
          }, 500);
    }

    ///MAIN METHODS///
    toggleGrid = () => {
        if (this.state.isAnimatingPath)
            return;
        this.setState({ showGrid: !this.state.showGrid });
    }

    removeWalls = () => {
        if (this.state.isAnimatingPath)
            return;
        let { nodes } = this.state;
        nodes = this.state.nodeController.ResetWalls(nodes);
        this.setState({nodes});
    }

    clearCheckedNodes = () => {
        if (this.state.isAnimatingPath) return;
        let { nodes, showGrid } = this.state;
        nodes = this.state.nodeController.ClearNodes(nodes, showGrid);
        this.setState({nodes});
    }

    setAlgorithmType = type => {
        this.setState({algorithmType: type});
    }

    setHeuristicType = type => {
        this.setState({heuristicType: type});
    }

    animatePath = () => {
        if (this.state.isAnimatingPath) return;
        this.clearCheckedNodes();
        this.setBeeToPos(this.state.startNode);
        this.setState({ isAnimatingPath: true });

        switch (this.state.algorithmType){
            case DIJKSTRA:
                this._animateDijkstra();
                break;
            case A_STAR:
                this._animateAStar();
                break;
            default:
                console.log("No algorithm selected");
                break;
        }
    }

    ///BEE METHODS///
    onBeeMouseDown = () => {
        if (this.state.isAnimatingPath ||
            this.state.isDragingStartNode || this.state.isDragingEndNode)
            return;

        window.event.preventDefault();
        const bee = document.getElementById("bee");
        const endEl = document.getElementById(`node${this.state.endNode.y}-${this.state.endNode.x}`);
        if (bee.offsetTop+2 === endEl.offsetTop && bee.offsetLeft+2 === endEl.offsetLeft){
            let { endNode, isDragingEndNode } = this.state;
            endNode.EndNodeOff();
            endNode = null;
            isDragingEndNode = true;
            this.setState({ endNode, isDragingEndNode });
            return;
        }

        let { startNode, isDragingStartNode } = this.state;
        startNode.StartNodeOff();
        startNode = null;
        isDragingStartNode = true;
        this.setState({ startNode, isDragingStartNode });
    }

    setBeeToPos = node => {
        const nodeEl = document.getElementById(`node${node.y}-${node.x}`);
        const bee = document.getElementById("bee");
        bee.style.top = nodeEl.offsetTop + "px";
        bee.style.left = nodeEl.offsetLeft + "px";
    }

    ///MOUSE METHODS///
    onMouseDown = (y, x) => {
        if (this.state.isAnimatingPath)
            return;
        window.event.preventDefault(); //To stop dragging the grid
        let { nodes, isDraggingMouse,
            startNode, endNode,
            isDragingStartNode, isDragingEndNode } = this.state;

        if (nodes[y][x].isStartNode){
            nodes[y][x].StartNodeOff();
            nodes[y][x].StartNodePreviewOn();
            startNode = null;
            isDragingStartNode = true;
        }
        else if (nodes[y][x].isEndNode){
            nodes[y][x].EndNodeOff();
            nodes[y][x].EndNodePreviewOn();
            endNode = null;
            isDragingEndNode = true;
        }
        else {
            nodes[y][x].ToggleWall();
            isDraggingMouse = true;
        }

        this.setState({nodes, isDraggingMouse,
            startNode, endNode,
            isDragingStartNode, isDragingEndNode});
    }

    onMouseEnter = (y, x) => {
        if (this.state.isDragingStartNode){
            const { nodes } = this.state;
            if (nodes[y][x].isEndNode){
                nodes[y][x].ErrorOn();
            }
            else {
                nodes[y][x].StartNodePreviewOn();
            }
            this.setState({nodes});
        }

        if (this.state.isDragingEndNode){
            const { nodes } = this.state;
            if (nodes[y][x].isStartNode){
                nodes[y][x].ErrorOn();
            }
            else {
                nodes[y][x].EndNodePreviewOn();
            }
            this.setState({nodes});
        }

        if (this.state.isDraggingMouse){
            const { nodes } = this.state;
            nodes[y][x].ToggleWall();
            this.setState({nodes});
        }
    }

    onMouseLeave = (y, x) => {
        if (this.state.isDragingStartNode){
            const { nodes } = this.state;
            if (nodes[y][x].isError){
                nodes[y][x].ErrorOff();
            }
            nodes[y][x].StartNodePreviewOff();
            this.setState({ nodes });
        }
        if (this.state.isDragingEndNode){
            const { nodes } = this.state;
            if (nodes[y][x].isError){
                nodes[y][x].ErrorOff();
            }
            nodes[y][x].EndNodePreviewOff();
            this.setState({ nodes });
        }
    }

    onMouseUp = (y, x) => {
        if (this.state.isDragingStartNode){
            let { nodes, startNode } = this.state;
            if (nodes[y][x].isEndNode){
                return;
            }
            nodes[y][x].StartNodeOn();
            startNode = nodes[y][x];
            this.setBeeToPos(startNode);
            this.setState({ nodes, startNode, isDraggingMouse: false, isDragingStartNode: false});
        }
        else if (this.state.isDragingEndNode){
            let { nodes, startNode, endNode } = this.state;
            if (nodes[y][x].isStartNode){
                return;
            }
            nodes[y][x].EndNodeOn();
            endNode = nodes[y][x];
            this.setBeeToPos(startNode);
            this.setState({ nodes, endNode, isDraggingMouse: false, isDragingEndNode: false});
        }
        else {
            this.setState({ isDraggingMouse: false, isDragingEndNode: false});
        }
    }

    ///PATH METHODS///
    _animateDijkstra = () => {
        let _dijkstra = new Dijkstra();
        const { nodes, startNode, endNode } = this.state;
        const visitedList = _dijkstra.GetDijkstra(nodes, startNode, endNode);
        const shortestPath = _dijkstra.GetShortestPath(endNode);
        this.state.nodeController.AnimatePath(visitedList, shortestPath, this.state.showGrid , () => {
            this.setState({ isAnimatingPath: false });
        });
        this.setState({nodes});
    }

    _animateAStar = () => {
        let _astar = new AStar();
        const { nodes, startNode, endNode, heuristicType } = this.state;
        const visitedList = _astar.GetAStar(nodes, startNode, endNode, heuristicType);
        const shortestPath = _astar.GetShortestPath(endNode);
        this.state.nodeController.AnimatePath(visitedList, shortestPath, this.state.showGrid , () => {
            this.setState({ isAnimatingPath: false });
        });
        this.setState({nodes});
    }

    ///RENDER///
    render(){
        const { nodes, showGrid } = this.state;
        return(
            <div id="pathfinder">
                <PathfinderHeader
                    toggleGrid = { this.toggleGrid }
                    removeWalls = { this.removeWalls }
                    clearCheckedNodes = { this.clearCheckedNodes }
                    setAlgorithmType = { this.setAlgorithmType }
                    setHeuristicType = { this.setHeuristicType }
                    animatePath = { this.animatePath }
                />
                <PathfinderBody
                    nodes = { nodes }
                    showGrid = { showGrid }
                    onMouseDown = { this.onMouseDown }
                    onMouseEnter = { this.onMouseEnter }
                    onMouseLeave = { this.onMouseLeave }
                    onMouseUp = { this.onMouseUp }
                />
                <PathfinderFooter />
                <Bee onBeeMouseDown = { this.onBeeMouseDown } />
            </div>
        )
    }
}