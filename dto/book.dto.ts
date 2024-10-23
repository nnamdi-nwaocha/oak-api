export interface CreateBookDTO {
    title: string;
    author: string;
    description: string;
}

export interface updateBookDTO {
    id: number;
    updates: Partial<CreateBookDTO>;
}
