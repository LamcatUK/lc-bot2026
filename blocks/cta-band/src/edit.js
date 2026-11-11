import { __ } from '@wordpress/i18n';
import { useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button, ToggleControl, TextControl, TextareaControl, SelectControl } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { title, text, ctaText, ctaUrl, surface, imageId, imageUrl, imageAlt } = attributes;
	const { brushTop, spaceTop, spaceBottom } = attributes;
	const blockProps = useBlockProps( { className: 'container lc-bot2026-editor-block' } );

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="Call to Action Band" textDomain="lc-bot2026">
			<TextControl label={ __( 'Heading', 'lc-bot2026' ) } value={ title } onChange={ ( v ) => setAttributes( { title: v } ) } />
			<TextareaControl label={ __( 'Text', 'lc-bot2026' ) } value={ text } onChange={ ( v ) => setAttributes( { text: v } ) } />
			<SelectControl label={ __( 'Surface', 'lc-bot2026' ) } value={ surface } options={ [ { value: "surface", label: "Page (light)" }, { value: "tint", label: "Tint" }, { value: "soft", label: "Soft accent" }, { value: "brand", label: "Brand (dark)" } ] } onChange={ ( v ) => setAttributes( { surface: v } ) } />
			<div className="lc-bot2026-editor-field">
				<label className="lc-bot2026-editor-field__label">{ __( 'Background photo (optional, makes the band dark with a drifting photo)', 'lc-bot2026' ) }</label>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={ ( m ) => setAttributes( { imageId: m.id, imageUrl: m.url, imageAlt: m.alt || '' } ) }
						allowedTypes={ [ 'image' ] }
						value={ imageId }
						render={ ( { open } ) => (
							<div className="lc-bot2026-editor-field__control">
								{ imageUrl && <img src={ imageUrl } alt={ imageAlt } style={ { maxWidth: '200px', display: 'block', marginBottom: '8px' } } /> }
								<Button variant="secondary" onClick={ open }>{ imageUrl ? __( 'Replace image', 'lc-bot2026' ) : __( 'Select image', 'lc-bot2026' ) }</Button>
								{ imageUrl && <Button variant="link" isDestructive onClick={ () => setAttributes( { imageId: 0, imageUrl: '', imageAlt: '' } ) }>{ __( 'Remove', 'lc-bot2026' ) }</Button> }
							</div>
						) }
					/>
				</MediaUploadCheck>
			</div>
			<div style={ { display: 'flex', gap: '12px' } }>
				<div style={ { flex: '1 1 0' } }><TextControl label={ __( 'Button text', 'lc-bot2026' ) } value={ ctaText } onChange={ ( v ) => setAttributes( { ctaText: v } ) } /></div>
				<div style={ { flex: '1 1 0' } }><TextControl type="url" label={ __( 'Button URL', 'lc-bot2026' ) } value={ ctaUrl } onChange={ ( v ) => setAttributes( { ctaUrl: v } ) } /></div>
			</div>
			<div style={ { display: 'flex', gap: '12px' } }>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Space above', 'lc-bot2026' ) } value={ spaceTop || 'normal' } options={ [ { value: 'normal', label: __( 'Normal', 'lc-bot2026' ) }, { value: 'small', label: __( 'Small', 'lc-bot2026' ) }, { value: 'none', label: __( 'None', 'lc-bot2026' ) } ] } onChange={ ( v ) => setAttributes( { spaceTop: v } ) } /></div>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Space below', 'lc-bot2026' ) } value={ spaceBottom || 'normal' } options={ [ { value: 'normal', label: __( 'Normal', 'lc-bot2026' ) }, { value: 'small', label: __( 'Small', 'lc-bot2026' ) }, { value: 'none', label: __( 'None', 'lc-bot2026' ) } ] } help={ __( 'Trim the gap between neighbouring blocks that share a colour.', 'lc-bot2026' ) } onChange={ ( v ) => setAttributes( { spaceBottom: v } ) } /></div>
			</div>
			<ToggleControl label={ __( 'Brush edge at the top', 'lc-bot2026' ) } help={ __( 'Paints this block over the bottom of the one above.', 'lc-bot2026' ) } checked={ !! brushTop } onChange={ ( v ) => setAttributes( { brushTop: v } ) } />
		</EditorBlockShell>
	);
}
