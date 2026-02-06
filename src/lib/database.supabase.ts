import { supabase } from './supabase';

// CRUD untuk mentors
export async function getMentors() {
  const { data, error } = await supabase.from('mentors').select('*');
  if (error) { console.error('Supabase getMentors error:', error); throw error; }
  return data;
}

export async function addMentor(mentor: any) {
  const { data, error } = await supabase.from('mentors').insert([mentor]);
  if (error) { console.error('Supabase addMentor error:', error); throw error; }
  return data;
}

// CRUD untuk interns
export async function getInterns() {
  const { data, error } = await supabase.from('interns').select('*');
  if (error) { console.error('Supabase getInterns error:', error); throw error; }
  return data;
}

export async function addIntern(intern: any) {
  const { data, error } = await supabase.from('interns').insert([intern]);
  if (error) { console.error('Supabase addIntern error:', error, intern); throw error; }
  return data;
}

export async function updateIntern(id: string, updates: any) {
  const { data, error } = await supabase.from('interns').update(updates).eq('id', id);
  if (error) { console.error('Supabase updateIntern error:', error); throw error; }
  return data;
}

export async function deleteIntern(id: string) {
  const { data, error } = await supabase.from('interns').delete().eq('id', id);
  if (error) { console.error('Supabase deleteIntern error:', error); throw error; }
  return data;
}

// CRUD untuk gallery
export async function getGallery() {
  const { data, error } = await supabase.from('gallery').select('*');
  if (error) { console.error('Supabase getGallery error:', error); throw error; }
  return data;
}

export async function addGalleryItem(item: any) {
  const { data, error } = await supabase.from('gallery').insert([item]);
  if (error) { console.error('Supabase addGalleryItem error:', error, item); throw error; }
  return data;
}
