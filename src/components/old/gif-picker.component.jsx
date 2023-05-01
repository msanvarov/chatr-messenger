import { useEffect, useState } from 'react';

function GifPicker() {
  const [searchTerm, setSearchTerm] = useState('');
  const [gifs, setGifs] = useState([]);

  useEffect(() => {
    const fetchGifs = async () => {
      if (searchTerm) {
        const response = await fetch(
          `https://api.giphy.com/v1/gifs/search?api_key=G9t2NdJSwXvmPA8Xr7rKQMp5afwWKkRm&q=${searchTerm}&limit=10`
        );
        const { data } = await response.json();
        setGifs(data);
      }
    };
    fetchGifs();
  }, [searchTerm]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for GIFs"
      />
      {gifs.map((gif) => (
        <img key={gif.id} src={gif.images.fixed_width.url} alt={gif.title} />
      ))}
    </div>
  );
}

export default GifPicker;
