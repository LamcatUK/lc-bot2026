import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { TextControl, SelectControl, ToggleControl } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { brushTop, spaceTop, spaceBottom, title, content, showDetails, formId, surface } = attributes;
	const blockProps = useBlockProps( { className: 'container lc-bot2026-editor-block' } );
	const spaceOptions = [ { value: 'normal', label: __( 'Normal', 'lc-bot2026' ) }, { value: 'small', label: __( 'Small', 'lc-bot2026' ) }, { value: 'none', label: __( 'None', 'lc-bot2026' ) } ];

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="Contact" textDomain="lc-bot2026">
			<TextControl label={ __( 'Heading', 'lc-bot2026' ) } value={ title } onChange={ ( v ) => setAttributes( { title: v } ) } />
			<div className="lc-bot2026-editor-field">
				<label className="lc-bot2026-editor-field__label">{ __( 'Words above the details', 'lc-bot2026' ) }</label>
				<RichText tagName="div" preserveWhiteSpace className="lc-bot2026-editor-field__control" placeholder={ __( 'Words above the details', 'lc-bot2026' ) } value={ content } onChange={ ( v ) => setAttributes( { content: v } ) } />
			</div>
			<ToggleControl label={ __( 'Show phone, email and social links', 'lc-bot2026' ) } help={ __( 'Read from Site-Wide Settings (General and Social tabs).', 'lc-bot2026' ) } checked={ !! showDetails } onChange={ ( v ) => setAttributes( { showDetails: v } ) } />
			<TextControl type="number" label={ __( 'Contact Form 7 form ID', 'lc-bot2026' ) } help={ __( 'The number in the form shortcode, from Contact > Contact Forms.', 'lc-bot2026' ) } value={ formId || 0 } onChange={ ( v ) => setAttributes( { formId: parseInt( v, 10 ) || 0 } ) } />
			<SelectControl label={ __( 'Surface', 'lc-bot2026' ) } value={ surface } options={ [ { value: 'surface', label: 'Page (light)' }, { value: 'tint', label: 'Tint' }, { value: 'soft', label: 'Soft accent' }, { value: 'brand', label: 'Brand (dark)' } ] } onChange={ ( v ) => setAttributes( { surface: v } ) } />
			<div style={ { display: 'flex', gap: '12px' } }>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Space above', 'lc-bot2026' ) } value={ spaceTop || 'normal' } options={ spaceOptions } onChange={ ( v ) => setAttributes( { spaceTop: v } ) } /></div>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Space below', 'lc-bot2026' ) } value={ spaceBottom || 'normal' } options={ spaceOptions } onChange={ ( v ) => setAttributes( { spaceBottom: v } ) } /></div>
			</div>
			<ToggleControl label={ __( 'Brush edge at the top', 'lc-bot2026' ) } checked={ !! brushTop } onChange={ ( v ) => setAttributes( { brushTop: v } ) } />
		</EditorBlockShell>
	);
}
