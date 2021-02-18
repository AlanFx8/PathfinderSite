import React from 'react';
import { DIJKSTRA, A_STAR } from '../types/algorithms-types';
import { RETURN_ONE, MANHATTAN_DISTANCE, EUCLIDEAN_DISTANCE } from '../types/heuristic-types';
import './css/pathfinder-header.css';

export default class PathfinderHeader extends React.Component {
    render(){
        const {
            toggleGrid,
            removeWalls,
            clearCheckedNodes,
            setAlgorithmType,
            setHeuristicType,
            animatePath
        } = this.props;
        
        return(
            <header id="pathfinder-header">
                <div className="header-row-divider">
                    <div className="header-option-element">
                        <button
                            type="button"
                            className="header-btn toggle-nodes-btn"
                            onClick={ toggleGrid }
                        >
                            Toggle Grid
                        </button>
                    </div>

                    <div className="header-option-element">
                        <button
                            type="button"
                            className="header-btn walls-nodes-btn"
                            onClick={ removeWalls }
                        >
                            Remove Walls
                        </button>
                    </div>

                    <div className="header-option-element">
                        <button
                            type="button"
                            className="header-btn clear-nodes-btn"
                            onClick={ clearCheckedNodes }
                        >
                            Clear Checked
                        </button>
                    </div>

                    <div className="header-option-element">
                        <div className="label">
                            Algorithm Type
                        </div>
                        <select
                            id="algorithm-type"
                            name="algorithm-type"
                            onChange={ () => setAlgorithmType(document.getElementById("algorithm-type").options[document.getElementById("algorithm-type").selectedIndex].value) }
                        >
                            <option value={ DIJKSTRA } >DIJKSTRA</option>
                            <option value={ A_STAR }>A_STAR</option>
                        </select>
                        <button
                            type="button"
                            className="header-btn animate-nodes-btn"
                            onClick={animatePath}
                        >
                            Animate Path
                        </button>
                    </div>
                </div>

                <div className="header-row-divider">
                <div className="header-option-element">
                        <div className="label">
                            Heuristic Type (AStar only)
                        </div>
                        <select
                            id="heuristic-type"
                            name="heurostic-type"
                            onChange={ () => setHeuristicType(document.getElementById("heuristic-type").options[document.getElementById("heuristic-type").selectedIndex].value) }
                        >
                            <option value={ RETURN_ONE } >Return 1</option>
                            <option value={ MANHATTAN_DISTANCE }>Manhattan Distance</option>
                            <option value={ EUCLIDEAN_DISTANCE }>Euclidean Distance</option>
                        </select>
                    </div>
                </div>
            </header>
        )
    }
}