import React from 'react';
import './css/pathfinder-body.css';

export default class PathfinderBody extends React.Component {
    getClassName = (isStartNode, isStartNodePreview,
        isEndNode, isEndNodePreview,
        isError, isWall, wall_bgx, showGrid) => {
        let string = `node`;

        if (isError){
            string += ' error';
        }
        else if (isStartNode){
            string += ' start';
        }
        else if (isStartNodePreview){
            string += ' start-hover'
        }
        else if (isEndNode){
            string += ' end';
        }
        else if (isEndNodePreview){
            string += ' end-hover';
        }
        else if (isWall) {
            string += ` wall wall${wall_bgx}`;
        }
        
        if (showGrid){
            string += ` grid`;
        }

        return string;
    }

    render(){
        const { nodes, showGrid } = this.props;
        const { onMouseDown, onMouseEnter, onMouseLeave, onMouseUp } = this.props;
        return (
            <div id="pathfinder-body">
                <div id="grid">
                    {nodes.map((y, row_index) => {
                        return(<div key={row_index} className="row-divider">
                            {y.map((node, node_index) =>{
                                const {y, x,
                                    isStartNode, isStartNodePreview,
                                    isEndNode, isEndNodePreview,
                                    isError, isWall, bgx, bgy, wall_bgx} = node;
                                const style = {
                                    backgroundPosition: `${bgx}px ${bgy}px`
                                };
                                const clsName = this.getClassName(
                                    isStartNode,
                                    isStartNodePreview,
                                    isEndNode,
                                    isEndNodePreview,
                                    isError,
                                    isWall,
                                    wall_bgx,
                                    showGrid
                                );

                                return <div
                                id= { `node${y}-${x}` }
                                key= { node_index }
                                className= { clsName }
                                style = { style }
                                onMouseDown = { () => onMouseDown(y, x) }
                                onMouseEnter = { () => onMouseEnter(y, x) }
                                onMouseLeave = { () => onMouseLeave(y, x) }
                                onMouseUp = { () => onMouseUp(y, x) }
                             />
                            })}
                        </div>);
                    })}
                </div>
            </div>
        );
    }
}