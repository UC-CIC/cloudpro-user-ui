import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
 
interface FormData {
  [key: string]: {
    [key: string]: string | number;
  }
}
 
export const FormCard: React.FC<{ steps: { name: string, fields: { name: string, text:string, type: string }[] }[] }> = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
 
  const onSubmit = (data: FormData) => {
    console.log(data);
  };
 
  console.log( "CS:", steps[currentStep] )
  const renderStep = () => {
    const step = steps[currentStep];
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        {step.fields.map(field => (
          <label key={field.name}>
            {field.text}:
            <input 
                type={field.type} 
                {...register(`${step.name}.${field.name}`,{ required: true })}
              />
          </label>
        ))}
        {errors[step.name] && <span>All fields are required</span>}
        <br />
        {currentStep > 0 && <button type="button" onClick={() => setCurrentStep(currentStep - 1)}>Previous</button>}
        {currentStep < steps.length - 1 && <button type="button" onClick={() => setCurrentStep(currentStep + 1)}>Next</button>}
        {currentStep === steps.length - 1 && <button type="submit">Submit</button>}
      </form>
    );
  }
 
  return (
    <>
      <h1>Step {currentStep + 1} of {steps.length}</h1>
      {renderStep()}
    </>
  );
};