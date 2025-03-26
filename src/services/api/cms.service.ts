import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '5881detq',
  dataset: 'production',
  apiVersion: '2025-03-24',
});

export const fetchInverterPackages = async () => {
  const query = `*[_type == "inverterPackages"] | order(capacity asc) {
    _id,
    title,
    "slug": slug.current,
    inverterCapacity,
    batteryCapacity,
    batteryType,
    backupTime,
    cost,
    description,
    "imageUrl": image.asset->url,
    defaultAppliances,
    moreAppliances
  }`;

  try {
    const result = await client.fetch(query);
    return result;
  } catch (error) {
    console.error('Error fetching inverter packages:', error);
    throw error;
  }
};
