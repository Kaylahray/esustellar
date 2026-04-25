import React from 'react';
import Button from '../components/ui/Button';

export default {
  title: 'UI/Button',
  component: Button,
};

export const Primary = () => <Button variant="primary">Primary</Button>;
export const Secondary = () => <Button variant="secondary">Secondary</Button>;
export const Outline = () => <Button variant="outline">Outline</Button>;
export const Disabled = () => <Button disabled>Disabled</Button>;
export const Loading = () => <Button loading>Loading</Button>;
