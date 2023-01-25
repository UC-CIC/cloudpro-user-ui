import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
 
interface FormData {
  [key: string]: {
    [key: string]: string | number;
  }
}
 
export const FormCard: React.FC<{ saveState:Function, steps: { name: string, fields: { name: string, text:string, type: string, value: any }[] }[] }> = ({ saveState,steps }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
 
  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  const onSave = (data: FormData) => {
    alert(JSON.stringify(data, null, 2));
    saveState(data);
  };
 
  const renderStep = () => {
    const step = steps[currentStep];

    let FieldContent;
        
    step.fields.map(field => {
      switch (field.type) {
        case 'text':
        case 'decimal':
          FieldContent = 
            <label key={field.name}>
              {field.text}:<br/>
              <input type="number" {...register(`${step.name}.${field.name}`,{ required: true })}/>
            </label>
          break;
        case 'dropdown':
          let OptionContent =[]
          for ( let [,option_value] of Object.entries(field.value as string) ){
            OptionContent.push(<option key={ `${step.name}.${option_value}` } value={option_value}>{option_value}</option>)
          }
          FieldContent = 
          <label key={field.name}>
            {field.text}:<br/>
            <select {...register(`${step.name}.${field.name}`,{ required: true })}>
              {OptionContent}
            </select>
          </label>
          break;        
        case 'radio':
          let RadioContent =[]
          for ( let [,radio_value] of Object.entries(field.value as string) ){
            RadioContent.push(<label key={ `${step.name}.${radio_value}` } >{radio_value}<input type={field.type} value={radio_value} {...register(`${step.name}.${field.name}`,{ required: true })}/></label>)
          }
          FieldContent = 
          <label key={field.name}>
              {field.text}:<br/>
              {RadioContent}
          </label>
          break;
          case 'hidden':
            FieldContent = <p>To be implemented... :: hidden</p>
            break;
        case 'useValues()':
          FieldContent = <p>To be implemented... :: useValues()'</p>
          break;
        default:
          console.log(`Invalid type of ${field.type}`);
      }
      return 0;
    });

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        {FieldContent}
        {/*
        {step.fields.map(field => (
              <label key={field.name}>
                {field.text}:
                <input 
                    type={field.type} 
                    {...register(`${step.name}.${field.name}`,{ required: true })}
                  />
              </label>
        ))}
        */}
        {errors[step.name] && <span>All fields are required</span>}
        <br />
        {currentStep > 0 && <button type="button" onClick={() => setCurrentStep(currentStep - 1)}>Previous</button>}
        {currentStep < steps.length - 1 && <button type="button" onClick={() => setCurrentStep(currentStep + 1)}>Next</button>}<br/>
        <button type="button" onClick={handleSubmit(onSave)}>Save Progress</button>
        {currentStep === steps.length - 1 && <button type="submit">Submit</button>}
      </form>
    );
  }
 
  return (
    <>
      <h1 className="content__title">Step {currentStep + 1} of {steps.length}</h1>
      {renderStep()}
    </>
  );
};