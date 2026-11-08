import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { ToggleControl, TextControl, SelectControl } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';
import RepeaterField from '../../_shared/RepeaterField';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { title, surface, tileRatio, tiles } = attributes;
	const { brushTop, spaceTop, spaceBottom } = attributes;
	const blockProps = useBlockProps( { className: 'container lc-bot2026-editor-block' } );

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="Tile Links" textDomain="lc-bot2026">
			<TextControl label={ __( 'Heading', 'lc-bot2026' ) } value={ title } onChange={ ( v ) => setAttributes( { title: v } ) } />
			<SelectControl label={ __( 'Surface', 'lc-bot2026' ) } value={ surface } options={ [ { value: "surface", label: "Page (light)" }, { value: "tint", label: "Tint" }, { value: "soft", label: "Soft accent" }, { value: "brand", label: "Brand (dark)" } ] } onChange={ ( v ) => setAttributes( { surface: v } ) } />
			<SelectControl label={ __( 'Tile shape', 'lc-bot2026' ) } value={ tileRatio } options={ [ { value: 'original', label: __( 'Original (no crop)', 'lc-bot2026' ) }, { value: 'landscape', label: __( 'Landscape (3:2)', 'lc-bot2026' ) }, { value: 'square', label: __( 'Square (1:1)', 'lc-bot2026' ) }, { value: 'portrait', label: __( 'Portrait (3:4)', 'lc-bot2026' ) } ] } onChange={ ( v ) => setAttributes( { tileRatio: v } ) } />
			<RepeaterField
				label={ __( 'Tiles', 'lc-bot2026' ) }
				value={ tiles }
				onChange={ ( v ) => setAttributes( { tiles: v } ) }
				fields={ [
					{ name: 'image', label: __( 'Image', 'lc-bot2026' ), type: 'image' },
					{ name: 'title', label: __( 'Title', 'lc-bot2026' ), type: 'text' },
					{ name: 'link', label: __( 'Link', 'lc-bot2026' ), type: 'link' },
				] }
				emptyRow={ { image: 0, imageUrl: '', title: '', linkText: '', linkUrl: '' } }
			/>
			<div style={ { display: 'flex', gap: '12px' } }>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Space above', 'lc-bot2026' ) } value={ spaceTop || 'normal' } options={ [ { value: 'normal', label: __( 'Normal', 'lc-bot2026' ) }, { value: 'small', label: __( 'Small', 'lc-bot2026' ) }, { value: 'none', label: __( 'None', 'lc-bot2026' ) } ] } onChange={ ( v ) => setAttributes( { spaceTop: v } ) } /></div>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Space below', 'lc-bot2026' ) } value={ spaceBottom || 'normal' } options={ [ { value: 'normal', label: __( 'Normal', 'lc-bot2026' ) }, { value: 'small', label: __( 'Small', 'lc-bot2026' ) }, { value: 'none', label: __( 'None', 'lc-bot2026' ) } ] } help={ __( 'Trim the gap between neighbouring blocks that share a colour.', 'lc-bot2026' ) } onChange={ ( v ) => setAttributes( { spaceBottom: v } ) } /></div>
			</div>
			<ToggleControl label={ __( 'Brush edge at the top', 'lc-bot2026' ) } help={ __( 'Paints this block over the bottom of the one above.', 'lc-bot2026' ) } checked={ !! brushTop } onChange={ ( v ) => setAttributes( { brushTop: v } ) } />
		</EditorBlockShell>
	);
}
