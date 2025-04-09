'use client'
import { useParams } from 'react-router-dom';

export default function SlugPage() {
  const { slug } = useParams();
  
  return (
    <div>
      <h1>Slug Page</h1>
      <p>Current slug: {slug}</p>
    </div>
  );
}
