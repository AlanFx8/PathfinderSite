class NodeController {
    ResetWalls = nodes => {
        for (let row of nodes){
            for (let node of row){
                node.WallOff();
            }
        }
        return nodes;
    }

    ClearNodes = (nodes, showGrid) => {
        for (let row of nodes){
            for (let node of row){
                node.local_distance = Infinity;
                node.global_distance = Infinity;
                node.isChecked = false;
                node.previousNode = null;
                if (node.isWall || node.isStartNode || node.isEndNode) continue;

                let clsName = 'node';
                if (showGrid) clsName+= ' grid';
                document.getElementById(`node${node.y}-${node.x}`).className = clsName;
            }
        }
        return nodes;
    }

    AnimatePath = (visitedList, shortestPath, showGrid, callback) => {
        for (let x = 0; x <= visitedList.length; x++){
            if (x === visitedList.length){
                setTimeout(() => {
                    this._animateShortestPath(shortestPath, 0, showGrid, callback);
                  }, 10 * x);
                return;
            }

            const node = visitedList[x];
            if (node.isStartNode || node.isEndNode) continue;
            let clsName = showGrid?'node visited grid':'node visited';
            setTimeout(() => {
                document.getElementById(`node${node.y}-${node.x}`).className =
               clsName;
            }, 10 * x);
        }
    }

    //Private Methods
    _animateShortestPath = (path, index, showGrid, callback) => {
        var pathAnimWrapper;
        var pathAnim = () => {
            const bee = document.getElementById("bee");
            const node = document.getElementById(`node${path[index].y}-${path[index].x}`);
            const speed = 6;

            if (bee.offsetTop !== node.offsetTop || bee.offsetLeft !== node.offsetLeft){                
                if (bee.offsetTop !== node.offsetTop){
                    let pos = bee.offsetTop;
                    if (node.offsetTop > pos){
                        bee.className = "down";
                        pos += speed;
                        if (node.offsetTop < pos){
                            pos = node.offsetTop;
                        }
                    }
                    else {
                        bee.className = "up";
                        pos -= speed;
                        if (node.offsetTop > pos){
                            pos = node.offsetTop;
                        }
                    }
                    bee.style.top = pos+"px";
                }
                if (bee.offsetLeft !== node.offsetLeft){
                    let pos = bee.offsetLeft;
                    if (node.offsetLeft > pos){
                        pos += speed;
                        bee.className = "right";
                        if (node.offsetLeft < pos){
                            pos = node.offsetLeft;
                        }
                    }
                    else {
                        bee.className = "left";
                        pos -= speed;
                        if (node.offsetLeft > pos){
                            pos = node.offsetLeft;
                        }
                    }
                    bee.style.left = pos+"px";
                }

                pathAnimWrapper = requestAnimationFrame(pathAnim);
            }
            else {
                if (path[index].isEndNode){
                    bee.className = "idle";
                    bee.style.left = bee.offsetLeft-2 + "px";
                    bee.style.top = bee.offsetTop-2 + "px";
                    cancelAnimationFrame(pathAnimWrapper);
                    callback();
                }
                else {
                    if (!path[index].isStartNode){
                        let clsName = showGrid?'node shortest grid':'node shortest';
                        document.getElementById(`node${path[index].y}-${path[index].x}`).className =
                        clsName;
                    }
                    index++;
                    pathAnimWrapper = requestAnimationFrame(pathAnim);
                }
            }
        }
        pathAnimWrapper = requestAnimationFrame(pathAnim);
    }

    _animateShortestPathX = (path, index, showGrid, callback, delayTimer, delayTime) => {
        var pathAnimWrapper;
        var pathAnim = () => {
            const bee = document.getElementById("bee");
            const node = document.getElementById(`node${path[index].y}-${path[index].x}`);

            //If we havn't reached target node...
            if (bee.offsetTop !== node.offsetTop || bee.offsetLeft !== node.offsetLeft){
                if (delayTimer !== delayTime){
                    delayTimer++;
                }
                else {
                        delayTimer = 0;
                        //First - set the animation             
                        if (bee.offsetTop !== node.offsetTop){
                            if (node.offsetTop > bee.offsetTop){
                                bee.className = "down";
                            }
                            else {
                                bee.className = "up";
                            }
                        }
                        else if (bee.offsetLeft !== node.offsetLeft) {
                            if (node.offsetLeft > bee.offsetLeft){
                                bee.className = "right";
                            }
                            else {
                                bee.className = "left";
                            }
                        }

                        //An attempt at a lerp but it's too fast
                        //Based on https://codepen.io/rachsmith/post/animation-tip-lerp
                        const timeDelay = .02;
                        let lerpX = (node.offsetLeft - bee.offsetLeft)*timeDelay;
                        let lerpY = (node.offsetTop - bee.offsetTop)*timeDelay;
                        bee.style.left = (node.offsetLeft - lerpX) + "px";
                        bee.style.top = (node.offsetTop - lerpY) + "px";
                }

                //Repeat animation
                pathAnimWrapper = requestAnimationFrame(pathAnim);
            }
            else { //If we have reached target node...
                if (path[index].isEndNode){
                    bee.className = "idle";
                    bee.style.left = bee.offsetLeft-2 + "px";
                    bee.style.top = bee.offsetTop-2 + "px";
                    cancelAnimationFrame(pathAnimWrapper);
                    callback();
                }
                else {
                    if (!path[index].isStartNode){
                        let clsName = showGrid?'node shortest grid':'node shortest';
                        document.getElementById(`node${path[index].y}-${path[index].x}`).className =
                        clsName;
                    }
                    index++;
                    pathAnimWrapper = requestAnimationFrame(pathAnim);
                }
            }
        }
        pathAnimWrapper = requestAnimationFrame(pathAnim);
    }
}

module.exports = NodeController;