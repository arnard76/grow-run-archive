// different type of conditions

type Duration = {
    start: string;
    end: string;
}

export type {Duration}

type Conditions = {
    duration?:Duration
}

export default Conditions