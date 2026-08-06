import { SetStateAction } from "react";
import { IMetaData } from "../../interface";

export interface IExamResultPaginationProps {
  meta: IMetaData;
  setPage: (value: SetStateAction<number>) => void;
}
