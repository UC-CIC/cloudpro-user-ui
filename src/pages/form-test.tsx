import React from "react";
import { PageLayout } from "../components/page-layout";
import { ProfileSetup } from "../components/profile-setup";


export const FormTest: React.FC = () => (
  <PageLayout>
    <ProfileSetup uid="test@email.com" profile={
        {
                email: "test@email.com",
                state: "STAGED",
                tfa: "tfa_email",
                profile: {
                    first_name:"",
                    last_name:"mcfirst",
                    birth_date:"1999-01-01",
                    birth_sex:"bs_m",
                    phone:"444-333-3123",
                    hospital:"h1",
                    surgeon:"s2",
                    surgery_date:"2023-02-27"
                },
                challenge: {
                    c1q:"c1q_a",
                    c1a:"my super",
                    c2q:"c2q_b",
                    c2a:"challenge",
                    c3q:"c3q_c",
                    c3a:"answer"
                }
        }

    }/>

  </PageLayout>
);