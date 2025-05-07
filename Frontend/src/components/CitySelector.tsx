import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";
import React from "react";

interface CitySelectorProps {
  onSelect: (value: string) => void;
  defaultValue?: string;
}

const CitySelector: React.FC<CitySelectorProps> = ({ onSelect, defaultValue }) => {
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(value) => onSelect(value)}
    >
      <SelectTrigger className="h-12">
        <MapPin className="mr-2 h-4 w-4 text-primary" />
        <SelectValue placeholder="Select city" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Popular Cities</SelectLabel>
          <SelectItem value="delhi">Delhi NCR</SelectItem>
          <SelectItem value="mumbai">Mumbai</SelectItem>
          <SelectItem value="bangalore">Bangalore</SelectItem>
          <SelectItem value="hyderabad">Hyderabad</SelectItem>
          <SelectItem value="pune">Pune</SelectItem>
          <SelectItem value="chennai">Chennai</SelectItem>
          <SelectItem value="kolkata">Kolkata</SelectItem>
          <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CitySelector;
