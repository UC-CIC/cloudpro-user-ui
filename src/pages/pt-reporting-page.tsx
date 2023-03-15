import { VStack } from "@chakra-ui/react";
import { BarChart } from "../components/reporting/bar-chart"

export function PtReporting() {

    return (

            <VStack h={500} justify="center" spacing={8}>
                <BarChart/>
            </VStack>
    );
}