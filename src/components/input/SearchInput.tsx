"use client"

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import useDebounce from '@/hooks/useDebounce';

interface SearchInputProps {
    onSearch: (value: string) => void;
    delay?: number;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, delay = 500 }) => {
    const [input, setInput] = useState("");
    const debouncedValue = useDebounce(input, delay);

    useEffect(() => {
        onSearch(debouncedValue);
    }, [debouncedValue]);

    return (
        <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
                type="text"
                placeholder="Search..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="pl-10"
            />
        </div>
    );
};

export default SearchInput;
