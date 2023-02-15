import { ParsedUrlQuery } from "querystring";
import { ReactNode } from "react";

export interface ChildrenProps {
  readonly children: ReactNode;
}

export interface ArchiveQuery extends ParsedUrlQuery {
  readonly location: "archive";
  readonly favorites?: "true";
}
