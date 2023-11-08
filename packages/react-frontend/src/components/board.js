import React from 'react';
import './board.css';

const rows = ["1", "2", "3", "4", "5", "6", "7", "8"];
const columns = ["a", "b", "c", "d", "e", "f", "g", "h"];



export default function Board() {

    function flipBoard(grid){
        return grid.reverse();
    }

    let grid = [];

    for(let i = rows.length-1; i>=0; i--){
        for(let j=0; j<columns.length; j++){
            const combination = i+j+2;
            if(i===0){                              //for the bottom row
                if(j===0){                          //for bottom left corner
                    if(combination%2 === 0){
                    
                        grid.push(
                            <div className="square dark-square">
                                <div className="left-center">
                                    {rows[i]}
                                </div>
                                <div className="bottom-center">
                                    {columns[j]}
                                </div>
                            </div>
                        )
                    }
                    else{
                        grid.push(
                            <div className="square light-square">
                                <div className="left-center">
                                    {rows[i]}
                                </div>
                                <div className="bottom-center">
                                    {columns[j]}
                                </div>
                            </div>
                        )
                    }
                }
                else{
                    if(combination%2 === 0){
                    
                        grid.push(
                            <div className="square dark-square">
                                <div className="bottom-center">
                                    {columns[j]}
                                </div>
                            </div>
                        )
                    }
                    else{
                        grid.push(
                            <div className="square light-square">
                                <div className="bottom-center">
                                    {columns[j]}
                                </div>
                            </div>
                        )
                    }
                }
            }
            else if(j===0){
                if(combination%2 === 0){
                    
                    grid.push(
                        <div className="square dark-square">
                            <div className="left-center">
                                {rows[i]}
                            </div>
                        </div>
                    )
                }
                else{
                    grid.push(
                        <div className="square light-square">
                            <div className="left-center">
                                {rows[i]}
                            </div>
                        </div>
                    )
                }
            }
            else{
                if(combination%2 === 0){
                    grid.push(
                        <div className="square dark-square"></div>
                    )
                }
                else{
                    grid.push(
                        <div className="square light-square"></div>
                    )
                }
            }
            
        }
    }

    //flipBoard(grid);


    return <div id = "board-class">{grid}</div>
}