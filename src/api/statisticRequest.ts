
import { httpClient } from "@/lib/httpClient";
import { MonthlyDocument, Statistic } from "@/types/Statistic";

const statisticRequest = {
    getEntityCounters: () => httpClient.get<Statistic[]>('statistics/entity-counters'),
    getDocumentStatusCounters: () => httpClient.get<Statistic[]>('statistics/document-status'),
    getMonthlyDocumentStatistics: () => httpClient.get<MonthlyDocument[]>('statistics/monthly-document-statistic'),
};

export default statisticRequest;