import React, { useState, useEffect } from 'react';
import { OutlinedInput, Select, MenuItem, IconButton, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddRounded';
import CircularProgress from '@material-ui/core/CircularProgress';
import RefreshIcon from '@material-ui/icons/RefreshRounded';
import Pagination from '@material-ui/lab/Pagination';
import _ from 'lodash';
import './TableList.scss';

const TableList = props => {
  const defaultFilters = {}
  _.get(props, 'filters', []).forEach(filter => {
    defaultFilters[filter.key] = { value: filter.value || '', type: filter.type, fields: filter.fields }
  })
  const [_rows, _setRows] = useState(props.rows)
  const [_filters, _setFilters] = useState(defaultFilters)
  const [_pageSize, _setPageSize] = useState(props.showAll ? props.rows.length : 10)
  const [_page, _setPage] = useState(1)
  const pageCount = Math.ceil(_rows.length / _pageSize)

  useEffect(() => {
    if (pageCount < _page)
      _setPage(1)
  }, [_pageSize])

  useEffect(() => {
    _setRows(props.rows)
  }, [props.rows])

  useEffect(() => {
    let rows = Object.assign([], props.rows)
    rows = rows.filter(row => {
      return Object.keys(_filters).every(key => {
        const { value, fields, type } = _filters[key]
        return fields.some(field => (type === 'select' && (value === 'all' || _.get(row,`${field}.value`, '') === value))
          || (type !== 'select' && _.get(row,`${field}.value`, '').toLowerCase().includes(value.toLowerCase()))
        )
      })
    })
    _setRows(rows)
    
  }, [props.rows, _filters])

  useEffect(()=> {
    _setPage(1);
  }, [_filters])

  const applyFilter = (e, fields, type) => {
    const filters = Object.assign({}, _filters)
    filters[e.target.name] = { value: e.target.value, fields, type }
    _setFilters(filters)
  }

  const sum = props.sum && _rows.map(row => row[props.sum.key]?.value || 0)
  .reduce((val1, val2) =>  val1 + val2, 0);

  return (
    <div className='TableList relw100'>
      <div className='tl-header'>
        <div className='tl-title'>
          <div className='flex row jcsb aic'>
            <div className='fs22 cstronggrey lh30 medium'>{props.title}</div>
            {props.sum && (
              <div className='marr10'>{props.sum.render(sum.toFixed(2))}</div>
            )}
            <div>
            {props.withRefresh &&
              <Tooltip title="Rafraîchir" placement="left">
                <IconButton disabled={props.loading}
                  size='small'
                  onClick={props.onRefresh}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            }
            {props.withAddButton &&
              <Tooltip title="Ajouter" placement="left">
                <IconButton
                  size='small'
                  onClick={props.onAddClick}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            }
          </div>
          </div>
          {props.subTitle && <div className='fs16 cgrey extralight'>{props.subTitle}</div>}
        </div>
        {(!props.showAll || props.filters)&& 
          <div className='tl-filters flex row jcsb'>
            {!props.showAll && 
              <div className='flex row aic'>
                <div className='fs14 cstronggrey marr10'>Afficher</div>
                <div className='tl-rowsNumber'>
                  <OutlinedInput
                    value={_pageSize}
                    type='number'
                    onChange={(e) => _setPageSize(parseInt(e.target.value))} />
                </div>
                <div className='fs14 cstronggrey marr10'>lignes</div>
              </div>
            }
            {props.filters &&
              <div className='flex row'>
                {props.filters.map((filter, i) => {
                  return (
                    <div key={i} className='flex row aic'>
                      <div className='fs14 cstronggrey marr10'>{filter.name}</div>
                      <div>
                        {filter.type === 'input' &&
                          <OutlinedInput
                            name={filter.key}
                            value={_.get(_filters[filter.key], 'value')}
                            placeholder={filter.name}
                            onChange={(e) => applyFilter(e, filter.fields, filter.type)} />
                        }
                        {
                          filter.type === 'select' &&
                          <Select
                            variant='outlined'
                            value={_.get(_filters[filter.key], 'value')}
                            onChange={(e) => applyFilter(e, filter.fields, filter.type)}
                            name={filter.key}>
                            {filter.options.map(option => (
                              <MenuItem key={option.value} value={option.value}>{option.name}</MenuItem>
                            ))
                            }
                          </Select>
                        }
                      </div>
                    </div>

                  )
                })}
              </div>
            }
          </div>
        }
      </div>
      <div className='tl-content'>
        {props.loading && 
          <div className='h200 flex jcc aic'>
             <CircularProgress size={20} />
          </div>
        }
        {props.error && 
          <div className='h200 flex jcc aic cred'>
             {props.error}
          </div>
        }
        {!props.loading && !props.error && 
          <table>
            <thead><tr>{props.columns.map(column => <td key={column.key}>{column.name}</td>)}</tr></thead>
            <tbody>
              {_rows.slice((_page - 1) * _pageSize, _page * _pageSize).map((row, i) => (
                <tr key={i} style={row.color ? { backgroundColor: row.color } : {} }>
                  {props.columns.map(column => <td key={column.key}>{row[column.key].render}</td>)}
                </tr>
              ))}

            </tbody>
          </table>}
        {!props.showAll && 
          <div className='tl-foot flex jcfe'>
            <Pagination count={pageCount}
              showFirstButton
              showLastButton
              page={_page}
              onChange={(e, page) => _setPage(page)} />
          </div>
        }
      </div>
    </div>
  )
}

TableList.defaultProps = {
  title: 'Striped Table with Hover',
  subTitle: 'Here is a subtitle for this table',
  columns: [
    { key: 'id', name: 'id' },
    { key: 'firstname', name: 'Prénom' },
    { key: 'lastname', name: 'Nom' }
  ],
  rows: [
    {
      id: '1',
      firstname: 'Besma',
      lastname: 'Smile'
    },
    {
      id: '2',
      firstname: 'Rahma',
      lastname: 'Houma'
    },
    {
      id: '3',
      firstname: 'Célia',
      lastname: 'Sissi'
    },
  ]
}

export default TableList