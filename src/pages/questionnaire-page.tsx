import React, { useEffect, useState } from "react";

import { PageLayout } from "../components/page-layout";
import { CodeSnippet } from "../components/code-snippet";

export const Questionnaire: React.FC = () => {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const getMessage = async () => {
      //const { data, error } = await apiCall();
      const data = "hello"
      const error = ""
      if (!isMounted) {
        return;
      }

      if (data) {
        setMessage(JSON.stringify(data, null, 2));
      }

      if (error) {
        setMessage(JSON.stringify(error, null, 2));
      }
    };

    getMessage();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PageLayout>
      <div className="content-layout">
        <a href="/">Go To Home</a>
        
        <h1 id="page-title" className="content__title">
          Questionnaire Page
        </h1>
        
        <div className="content__body">
          <span>
                  This page retrieves a <strong>message</strong> from the Universal PRO Connector
                  microservice API.
          </span>  
          <CodeSnippet title="API Message" code={message} />      
        </div>
      </div>
    </PageLayout>
  )
};