import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { TextControl, ToggleControl, Button } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { title, pillText, intro, imageId, imageUrl, imageAlt, ctaText, ctaUrl, brushEdge } = attributes;
	const blockProps = useBlockProps( { className: 'container lc-bot2026-editor-block' } );

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="Page Hero" textDomain="lc-bot2026">
			<TextControl label={ __( 'Title (blank = page title)', 'lc-bot2026' ) } value={ title } onChange={ ( v ) => setAttributes( { title: v } ) } />
			<TextControl label={ __( 'Pill label', 'lc-bot2026' ) } help={ __( 'Short text on a brush stroke above the title. Optional.', 'lc-bot2026' ) } value={ pillText } onChange={ ( v ) => setAttributes( { pillText: v } ) } />
			<div className="lc-bot2026-editor-field">
				<label className="lc-bot2026-editor-field__label">{ __( 'Intro', 'lc-bot2026' ) }</label>
				<RichText tagName="div" className="lc-bot2026-editor-field__control" placeholder={ __( 'Intro', 'lc-bot2026' ) } value={ intro } onChange={ ( v ) => setAttributes( { intro: v } ) } />
			</div>
			<div className="lc-bot2026-editor-field">
				<label className="lc-bot2026-editor-field__label">{ __( 'Photo (blank = featured image)', 'lc-bot2026' ) }</label>
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
			<ToggleControl label={ __( 'Brush edge at the bottom', 'lc-bot2026' ) } checked={ !! brushEdge } onChange={ ( v ) => setAttributes( { brushEdge: v } ) } />
		</EditorBlockShell>
	);
}
