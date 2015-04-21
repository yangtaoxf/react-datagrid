'use strict';

require('./index.styl')

var Guid = require('guid')
var sorty = require('sorty')
var React = require('react')
var DataGrid = require('./src')
var faker = window.faker = require('faker');
var preventDefault = require('./src/utils/preventDefault')

var gen = (function(){

    var cache = {}

    return function(len){

        if (cache[len]){
            // return cache[len]
        }

        var arr = []

        for (var i = 0; i < len; i++){
            arr.push({
                id       : i + 1,
                // id: Guid.create(),
                grade      : Math.round(Math.random() * 10),
                email    : faker.internet.email(),
                firstName: faker.name.firstName(),
                lastName : faker.name.lastName(),
                birthDate: faker.date.past(),
                country  : faker.address.country(),
                city  : faker.address.city()
            })
        }

        cache[len] = arr

        return arr
    }
})()

var columns = [
    {
        name: 'country',
        style: {
            color: 'red',
            textAlign: 'right'
        },
        width: 150
    },
    {
        name: 'id',
        filterable: false,
        type: 'number',
        width: 350
    },
    {
        name: 'grade',
        type: 'number',
        title: <span>a grade</span>,
        width: 350
    },
    {
        name: 'email',
        minWidth: 200,
        flex: 1
    },
    {
        name: 'lastName',
        minWidth: 100,
        width: 350
    }
]

var ROW_HEIGHT = 31
var LEN = 1000
var SORT_INFO = []//[ { name: 'id', dir: 'asc'} ]
var sort = sorty(SORT_INFO)
var data = gen(LEN)
var origData = [].concat(data)

var selected = 1
var App = React.createClass({


    handleSortChange: function(sortInfo){
        SORT_INFO = sortInfo
        // debugger
        console.log('sorting', sortInfo)
        this.setState({})
    },

    onColumnChange: function(column, visible){
        column.hidden = !visible

        this.setState({})
    },

    onColumnOrderChange: function(index, dropIndex){
        var col = columns[index]
        columns.splice(index, 1) //delete from index, 1 item
        columns.splice(dropIndex, 0, col)
        this.setState({})
    },

    onColumnResize: function(firstCol, firstSize, secondCol, secondSize){
        firstCol.width = firstCol.minWidth = firstSize

        // if (secondCol){
        //     secondCol.width = secondCol.minWidth = secondSize
        // }

        this.setState({})
    },

    render: function(){
        var sort = sorty(SORT_INFO)

        // data = sort(origData)

        var groupBy = ['grade','country']

        function rowStyle(data, props){
            var style = {}
            if (props.index % 4 == 0){
                style.color = 'blue'
                // props.selected = true
            }
            return style
        }

        function blue(data, props){
            if (props.index % 4 == 0){
                return 'blue'
            }
        }

        function f(props){
            return <div {...props} />
        }

        var filter = function(column, value, values){
            console.log('filter for ' + column.name + ' = ', value, values)

            value = value.toUpperCase()

            if (!value){
                data = [].concat(origData)
            } else {

                data = origData.filter(function(item){
                    if (item[column.name].toUpperCase().indexOf(value) === 0){
                        return true
                    }
                })
            }

            this.setState({})
        }.bind(this)

        var clearFilter = function(){
            data = [].concat(origData)

            this.setState({})
        }.bind(this)

        var onSelectionChange = function(sel, data){
            selected = sel
            console.log(sel);
            this.setState({})
        }.bind(this)


        var refresh = function(){
            data = gen(LEN)
            this.setState({})
        }.bind(this)

        console.log(selected);

        return <div >

            <DataGrid
                onFilter={filter}
                liveFilter={true}
                selected={selected}
                onSelectionChange={onSelectionChange}
                xonColumnVisibilityChange={this.onColumnChange}
                onColumnOrderChange={this.onColumnOrderChange}
                onColumnResize={this.onColumnResize}
                sortInfo={SORT_INFO}
                xgroupBy={groupBy}
                rowStyle={rowStyle}
                rowClassName={blue}
                xrowFactory={f}
                onSortChange={this.handleSortChange}
                xscrollBy={5}
                idProperty='id'
                style={{border: '1px solid gray', height: 500, margin: 10}}
                showCellBorders={true}
                rowHeight={ROW_HEIGHT}
                virtualRendering={true}
                emptyText='testing'
                cellPadding={'0px 5px'}
                data={data} columns={columns}/>

        </div>

    }
})

React.render((
    <App />
), document.getElementById('content'))