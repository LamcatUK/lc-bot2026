import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { TextControl, TextareaControl, SelectControl, ToggleControl } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { brushTop, spaceTop, spaceBottom, formId, title, text, surface } = attributes;
	const blockProps = useBlockProps( { className: 'container lc-bot2026-editor-block' } );
	const spaceOptions = [ { value: 'normal', label: __( 'Normal', 'lc-bot2026' ) }, { value: 'small', label: __( 'Small', 'lc-bot2026' ) }, { value: 'none', label: __( 'None', 'lc-bot2026' ) } ];

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="Newsletter Sign-up" textDomain="lc-bot2026">
			<p>{ __( 'The form is made and edited under Mailchimp for WP > Forms. Choose which one to show here by its ID.', 'lc-bot2026' ) }</p>
			<TextControl type="number" label={ __( 'Form ID (0 = the default form)', 'lc-bot2026' ) } value={ formId || 0 } onChange={ ( v ) => setAttributes( { formId: parseInt( v, 10 ) || 0 } ) } />
			<TextControl label={ __( 'Heading', 'lc-bot2026' ) } value={ title } onChange={ ( v ) => setAttributes( { title: v } ) } />
			<TextareaControl label={ __( 'Text', 'lc-bot2026' ) } value={ text } onChange={ ( v ) => setAttributes( { text: v } ) } />
			<SelectControl label={ __( 'Surface', 'lc-bot2026' ) } value={ surface } options={ [ { value: 'brand', label: 'Brand (dark)' }, { value: 'surface', label: 'Page (light)' }, { value: 'tint', label: 'Tint' }, { value: 'soft', label: 'Soft accent' } ] } onChange={ ( v ) => setAttributes( { surface: v } ) } />
			<div style={ { display: 'flex', gap: '12px' } }>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Space above', 'lc-bot2026' ) } value={ spaceTop || 'normal' } options={ spaceOptions } onChange={ ( v ) => setAttributes( { spaceTop: v } ) } /></div>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Space below', 'lc-bot2026' ) } value={ spaceBottom || 'normal' } options={ spaceOptions } onChange={ ( v ) => setAttributes( { spaceBottom: v } ) } /></div>
			</div>
			<ToggleControl label={ __( 'Brush edge at the top', 'lc-bot2026' ) } checked={ !! brushTop } onChange={ ( v ) => setAttributes( { brushTop: v } ) } />
		</EditorBlockShell>
	);
}
