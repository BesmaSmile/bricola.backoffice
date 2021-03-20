import React, { useState } from 'react';
import { OutlinedInput, FormControl, InputLabel } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/AddRounded';
import ClearIcon from '@material-ui/icons/ClearRounded';
import './KeywordsForm.scss';

const KeywordsForm = (props) => {
  const { keywords, updateKeywords } = props
  const [_keywordValue, _setKeywordValue] = useState('');


  const handleAdd = () => {
    updateKeywords([...(keywords ?? []), _keywordValue]);
    _setKeywordValue('');
  };

  const handleDelete = (i) => {
    updateKeywords(keywords?.filter((keyword, index) => i !== index));
  };

  return (
    <div className="KeywordsForm">
      <div className="flex row aic">
        <FormControl variant="outlined">
          <InputLabel shrink={true} htmlFor="component-outlined">
            Mot clé
          </InputLabel>
          <OutlinedInput
            label="Mot clé"
            value={_keywordValue}
            onChange={(e) => _setKeywordValue(e.target.value)}
          />
        </FormControl>
        <IconButton size="small" onClick={handleAdd} disabled={!_keywordValue || _keywordValue === ''}>
          <AddIcon />
        </IconButton>
      </div>
      <div className="flex row aic fww mart15">
        {keywords?.map((keyword, i) => (
          <div key={i} className="kf-keyword fs12">
            <div>{keyword}</div>
            <IconButton size="small" onClick={() => handleDelete(i)} className="kf-deleteButton">
              <ClearIcon />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeywordsForm;
