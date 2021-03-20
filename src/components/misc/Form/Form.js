import React, { useEffect} from 'react';
import { useForm, useWatch, Controller } from "react-hook-form";
import { OutlinedInput, InputLabel, FormControl, FormControlLabel, Select, MenuItem, Switch, Checkbox } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from '@material-ui/core';
import _ from 'lodash';
import './Form.scss';

const FormLayout = ({ isDialog, title, content, submitAction, submitButton, cancelDisabled, cancel }) => {
  if (isDialog) return (
    <div className='Form'>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <div className='form-content'>{content}</div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained"
          disabled={cancelDisabled}
          classes={{
            root: 'frm-cancelButton'
          }}
          onClick={cancel}>Annuler
          </Button>
        {submitButton(submitAction)}
      </DialogActions>
    </div>

  )
  else return (
    <form className='Form' onSubmit={submitAction} >
      {content}
      <div className='frm-largeButton relw100 mart20'>{submitButton()}</div>
    </form>
  )
}

const Form = (props) => {
  const { title, inputs, onSubmit, submitText, pending, disabled, isDialog, cancel } = props
  let inputElements = []
  inputs.forEach(lineInputs => {
    if (Array.isArray(lineInputs)) {
      lineInputs.forEach(input => {
        inputElements.push(input)
      })
    }
    else inputElements.push(lineInputs)
  })

  const defaultValues = {}

  inputElements.forEach(input => {
    if (input.defaultValue) {
      _.set(defaultValues, input.name, input.defaultValue)
    }
  })
  const { handleSubmit, errors, control, setValue,getValues } = useForm();

  const values = useWatch({
    control,
    defaultValue: defaultValues,
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      var element = document.querySelector(`div[witherror=true] .frm-error`);
      if (element)
        element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }
  }, [errors]);

  const updateWatchingInputs = (e) => {
    const { name, value } = e.target
    const watchingInputs = inputElements.filter(input => input.watch === name)
    watchingInputs.forEach(watchingInput => {
      if(watchingInput.type === 'select') {
        setValue(watchingInput.name);
      }
      else {
        setValue(watchingInput.name, value);
      }
    });
  }

  const cleanAndSubmit = (values) => {
    const toSend = _.omitBy(values, value => _.isNil(value) || value === '');
    onSubmit(toSend)
  }

  const formContent = () => (
    <div className='flex col'>
      {inputs.map((lineInputs, i) => {
        if (lineInputs.content)
          return lineInputs.content(values)
        else {
          if (!Array.isArray(lineInputs)) lineInputs = [lineInputs];
          return (
            <div key={`frm-lineInput${i}`} className='frm-lineInputs relw100'>
              {lineInputs.map(input => {
                if (input.content)
                  return input.content(values)
                else {
                  const type = ['select', 'switch', 'check'].find(t => t === input.type) || 'default'
                  const additionalValidation = input.combinedValdation ? { validate: value => input.combinedValdation(getValues()) } : {}
                  const adornments = {
                    endAdornment: input.endAdornment,
                    startAdornment: input.startAdornment
                  }

                  return (
                    <>
                      {(input.type !== 'select' || input.options(_.get(values, input.watch)))
                        && (!input.hidden || !input.hidden(_.get(values, input.watch))) &&
                        <div key={input.name}
                          witherror={_.get(errors, input.name) ? 'true' : 'false'}
                          dontdisplay={input.dontDisplay ? 'true' : 'false'}
                          className={`frm-inputField flex col ${type !== 'check' ? 'marv10' : ''}`}>
                          <FormControl variant="outlined" key={input.name}>
                            {type !== 'switch' && type !== 'check' && <InputLabel shrink={input.shrink} htmlFor="component-outlined">
                              <span>{input.label} </span>
                            </InputLabel>}
                            <Controller
                              control={control}
                              name={input.name}
                              defaultValue={input.defaultValue}
                              rules={{ ...input.validation, ...additionalValidation }}
                              render={({ onChange, onBlur, value, name }) => (
                                <>
                                  {type === 'select' &&
                                    <Select
                                      label={input.label}
                                      error={errors[input.name] ? true : false}
                                      onChange={(e) => { onChange(e); updateWatchingInputs(e); }}
                                      onBlur={onBlur}
                                      value={value}
                                      name={name}
                                      disabled={disabled || input.disabled}>
                                      {input.options(_.get(values, input.watch)).map(option => (
                                        <MenuItem key={option.value} value={option.value}>{option.name}</MenuItem>
                                      ))
                                      }
                                    </Select>
                                  }
                                  {type === 'switch' &&
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={value}
                                          onChange={e => { onChange(e.target.checked); updateWatchingInputs(e); }}
                                          name={name}
                                          disabled={disabled || input.disabled}
                                          inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />}
                                      label={input.label} />
                                  }
                                  {type === 'check' &&
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={value}
                                          onChange={e => { onChange(e.target.checked); updateWatchingInputs(e); }}
                                          name={name}
                                          disabled={disabled || input.disabled}
                                          inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />}
                                      label={input.label} />
                                  }
                                  {type === 'default' &&
                                    <OutlinedInput
                                      label={input.label}
                                      placeholder={input.placeholder}
                                      onChange={(e) => { onChange(e); updateWatchingInputs(e); }}
                                      multiline={input.multiline}
                                      rows={input.rows}
                                      onBlur={onBlur}
                                      value={value}
                                      name={name}
                                      disabled={disabled || input.disabled}
                                      error={_.get(errors, input.name) ? true : false}
                                      type={input.type || 'text'}
                                      {...adornments} />
                                  }
                                </>

                              )} />

                          </FormControl>
                          <div className='frm-error fs12 marl3 mart5 cred light' >{_.get(errors, `${input.name}.message`)}</div>
                        </div>
                      }
                    </>
                  )
                }
              })}
            </div>
          )
        }
      })}
    </div>
  )
  const submitButton = (onClick) => (
    <Button variant="contained"
      classes={{
        root: 'frm-submitButton'
      }}
      type='submit'
      disabled={pending || disabled}
      onClick={onClick}>
      {!pending ? submitText : "En cours..."}
    </Button>
  )
  const submitAction = handleSubmit(cleanAndSubmit)
  return (
    <FormLayout
      title={title}
      cancelDisabled={pending}
      content={formContent()}
      isDialog={isDialog}
      submitAction={submitAction}
      submitButton={submitButton}
      cancel={cancel} />
  )
}

export default Form;
