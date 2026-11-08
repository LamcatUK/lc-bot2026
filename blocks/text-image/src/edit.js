import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { TextControl, SelectControl, ToggleControl, Button } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { title, content, imageId, imageUrl, imageAlt, imageSide, videoUrl, imageRatio, brushMask, surface, ctaText, ctaUrl } = attributes;
	const { brushTop, spaceTop, spaceBottom } = attributes;
	const blockProps = useBlockProps( { className: 'container lc-bot2026-editor-block' } );

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="Text and Media" textDomain="lc-bot2026">
			<TextControl label={ __( 'Title', 'lc-bot2026' ) } value={ title } onChange={ ( v ) => setAttributes( { title: v } ) } />
			<div className="lc-bot2026-editor-field">
				<label className="lc-bot2026-editor-field__label">{ __( 'Content', 'lc-bot2026' ) }</label>
				<RichText tagName="div" preserveWhiteSpace className="lc-bot2026-editor-field__control" placeholder={ __( 'Content', 'lc-bot2026' ) } value={ content } onChange={ ( v ) => setAttributes( { content: v } ) } />
			</div>
			<div className="lc-bot2026-editor-field">
				<label className="lc-bot2026-editor-field__label">{ __( 'Image', 'lc-bot2026' ) }</label>
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
			<TextControl type="url" label={ __( 'Video address (optional)', 'lc-bot2026' ) } help={ __( 'A YouTube or Vimeo link. When set, the video replaces the photo.', 'lc-bot2026' ) } value={ videoUrl } onChange={ ( v ) => setAttributes( { videoUrl: v } ) } />
			<div style={ { display: 'flex', gap: '12px' } }>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Image side', 'lc-bot2026' ) } value={ imageSide } options={ [ { value: 'right', label: 'Right' }, { value: 'left', label: 'Left' } ] } onChange={ ( v ) => setAttributes( { imageSide: v } ) } /></div>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Surface', 'lc-bot2026' ) } value={ surface } options={ [{"value":"surface","label":"Page (light)"},{"value":"tint","label":"Tint"},{"value":"soft","label":"Soft accent"},{"value":"brand","label":"Brand (dark)"}] } onChange={ ( v ) => setAttributes( { surface: v } ) } /></div>
			</div>
			<SelectControl label={ __( 'Photo shape', 'lc-bot2026' ) } help={ __( 'Original shows the whole photo. The others crop to fit.', 'lc-bot2026' ) } value={ imageRatio } options={ [ { value: 'original', label: __( 'Original (no crop)', 'lc-bot2026' ) }, { value: 'landscape', label: __( 'Landscape (3:2)', 'lc-bot2026' ) }, { value: 'widescreen', label: __( 'Widescreen (16:9)', 'lc-bot2026' ) }, { value: 'square', label: __( 'Square (1:1)', 'lc-bot2026' ) }, { value: 'portrait', label: __( 'Portrait (3:4)', 'lc-bot2026' ) } ] } onChange={ ( v ) => setAttributes( { imageRatio: v } ) } />
			<ToggleControl label={ __( 'Brush edge on the photo', 'lc-bot2026' ) } checked={ !! brushMask } onChange={ ( v ) => setAttributes( { brushMask: v } ) } />
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
