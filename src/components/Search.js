import React, { useState } from 'react';
import { TextField, Button, Chip, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';

const Search = ({ onSearch, categories = [], tags = [], selectedCategories = [], selectedTags = [], onCategoryChange, onTagChange }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <Box sx={{ padding: '2rem 0', background: '#fff' }}>
      <div className="container">
        <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto' }}>
          <TextField
            fullWidth
            label="Search by keyword, category, or tag (comma-separated)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" sx={{ mr: 2 }}>Search</Button>
        </form>

        {/* Category Filter */}
        <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
          <InputLabel>Filter by Category</InputLabel>
          <Select
            multiple
            value={selectedCategories}
            onChange={(e) => onCategoryChange(e.target.value)}
            label="Filter by Category"
          >
            {categories.map(cat => (
              <MenuItem key={cat.slug} value={cat.slug}>{cat.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Tag Filter */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Filter by Tag</InputLabel>
          <Select
            multiple
            value={selectedTags}
            onChange={(e) => onTagChange(e.target.value)}
            label="Filter by Tag"
          >
            {tags.map(tag => (
              <MenuItem key={tag.slug} value={tag.slug}>{tag.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Selected Chips */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {selectedCategories.map(cat => (
            <Chip key={cat} label={categories.find(c => c.slug === cat)?.name} onDelete={() => onCategoryChange(selectedCategories.filter(c => c !== cat))} color="primary" />
          ))}
          {selectedTags.map(tag => (
            <Chip key={tag} label={tags.find(t => t.slug === tag)?.name} onDelete={() => onTagChange(selectedTags.filter(t => t !== tag))} color="secondary" />
          ))}
        </Box>
      </div>
    </Box>
  );
};

export default Search;