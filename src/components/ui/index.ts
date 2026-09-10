// Button
export { Button } from './button'
export type { ButtonProps, ButtonVariant, ButtonSize } from './button'

// Input
export { Input } from './input'
export type { InputProps } from './input'

// Badge
export { Badge } from './badge'
export type { BadgeProps, BadgeVariant } from './badge'

// Card
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './card'
// CardProps removed — Card uses React.HTMLAttributes<HTMLDivElement> directly

// Dialog
export {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogContent,
} from './dialog'
export type { DialogProps } from './dialog'

// Skeleton
export { Skeleton } from './skeleton'
// SkeletonProps removed — Skeleton uses React.HTMLAttributes<HTMLDivElement> directly

// Toast
export { ToastProvider, useToast } from './toast'
export type { Toast, ToastVariant } from './toast'

// Tabs
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'
export type { TabsProps, TabsTriggerProps, TabsContentProps } from './tabs'

// Select
export { Select } from './select'
export type { SelectProps } from './select'

// Textarea
export { Textarea } from './textarea'
export type { TextareaProps } from './textarea'

// Checkbox
export { Checkbox } from './checkbox'
export type { CheckboxProps } from './checkbox'

// Tooltip
export { Tooltip } from './tooltip'
export type { TooltipProps, TooltipPosition } from './tooltip'

// Dropdown
export { Dropdown } from './dropdown'
export type { DropdownProps, DropdownItem } from './dropdown'

// Table
export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './table'

// Moroccan City Combobox
export { MoroccanCityCombobox } from './moroccan-city-combobox'
export type { MoroccanCityComboboxProps } from './moroccan-city-combobox'

// Vehicle Color Picker
export { VehicleColorPicker } from './vehicle-color-picker'
export type { VehicleColorPickerProps } from './vehicle-color-picker'

// Vehicle Taxonomy Selector (Marque -> Modèle -> Version)
export { VehicleTaxonomySelector } from '@/components/vehicles/vehicle-taxonomy-selector'
export type { VehicleTaxonomySelectorProps } from '@/components/vehicles/vehicle-taxonomy-selector'

// Vehicle Customs & Origin Selector (WW Maroc vs Dédouanée)
export { VehicleCustomsSelector } from '@/components/vehicles/vehicle-customs-selector'
export type { VehicleCustomsSelectorProps, VehicleCustomsStatus } from '@/components/vehicles/vehicle-customs-selector'

// Moroccan License Plate Input (xxxxxx | x | xx)
export { MoroccanPlateInput, MOROCCAN_PREFECTURE_CODES, MOROCCAN_SERIES_LETTERS } from './moroccan-plate-input'
export type { MoroccanPlateInputProps } from './moroccan-plate-input'

