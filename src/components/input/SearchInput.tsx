"use client"

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import useDebounce from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

interface SearchInputProps {
    onSearch: (value: string) => void;
    delay?: number;
    className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, delay = 500, className }) => {
    const [input, setInput] = useState("");
    const debouncedValue = useDebounce(input, delay);

    useEffect(() => {
        onSearch(debouncedValue);
    }, [debouncedValue]);

    return (
        <div className={cn("relative w-full", className)}>
            <Search className="absolute left-3 top-[10px] text-muted-foreground" size={18} />
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
