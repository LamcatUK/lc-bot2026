import { __ } from '@wordpress/i18n';
import { useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button, TextControl, SelectControl, ToggleControl } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';
import RepeaterField from '../../_shared/RepeaterField';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { brushTop, spaceTop, spaceBottom, title, quotes, surface, imageId, imageUrl, imageAlt } = attributes;
	const blockProps = useBlockProps( { className: 'container lc-bot2026-editor-block' } );
	const spaceOptions = [ { value: 'normal', label: __( 'Normal', 'lc-bot2026' ) }, { value: 'small', label: __( 'Small', 'lc-bot2026' ) }, { value: 'none', label: __( 'None', 'lc-bot2026' ) } ];

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="Pullquote" textDomain="lc-bot2026">
			<p>{ __( 'Add one quote to show it on its own. Add two or more and they become a slider.', 'lc-bot2026' ) }</p>
			<TextControl label={ __( 'Heading (optional)', 'lc-bot2026' ) } value={ title } onChange={ ( v ) => setAttributes( { title: v } ) } />
			<RepeaterField
				label={ __( 'Quotes', 'lc-bot2026' ) }
				value={ quotes }
				onChange={ ( v ) => setAttributes( { quotes: v } ) }
				layout="column"
				fields={ [
					{ name: 'quote', label: __( 'Quote (no quotation marks)', 'lc-bot2026' ), type: 'textarea' },
					{ name: 'name', label: __( 'Name', 'lc-bot2026' ), type: 'text' },
					{ name: 'detail', label: __( 'Place or course', 'lc-bot2026' ), type: 'text' },
				] }
				emptyRow={ { quote: '', name: '', detail: '' } }
			/>
			<div className="lc-bot2026-editor-field">
				<label className="lc-bot2026-editor-field__label">{ __( 'Background photo (optional, makes the block dark with a drifting photo)', 'lc-bot2026' ) }</label>
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
			<SelectControl label={ __( 'Surface', 'lc-bot2026' ) } value={ surface } options={ [ { value: 'surface', label: 'Page (light)' }, { value: 'tint', label: 'Tint' }, { value: 'soft', label: 'Soft accent' }, { value: 'brand', label: 'Brand (dark)' } ] } onChange={ ( v ) => setAttributes( { surface: v } ) } />
			<div style={ { display: 'flex', gap: '12px' } }>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Space above', 'lc-bot2026' ) } value={ spaceTop || 'normal' } options={ spaceOptions } onChange={ ( v ) => setAttributes( { spaceTop: v } ) } /></div>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Space below', 'lc-bot2026' ) } value={ spaceBottom || 'normal' } options={ spaceOptions } onChange={ ( v ) => setAttributes( { spaceBottom: v } ) } /></div>
			</div>
			<ToggleControl label={ __( 'Brush edge at the top', 'lc-bot2026' ) } checked={ !! brushTop } onChange={ ( v ) => setAttributes( { brushTop: v } ) } />
		</EditorBlockShell>
	);
}
